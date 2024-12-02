import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {  RpcException } from '@nestjs/microservices';
import { Raw, Repository } from 'typeorm';
import {
  UploadStatus,
  UploadVersionEntity,
} from '@app/common/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferingResponseDto } from '@app/common/dto/offering';
import { DiscoveryMessageDto } from '@app/common/dto/discovery';
import { ComponentDto, PlatformDto } from '@app/common/dto/discovery';

@Injectable()
export class OfferingService {
  private readonly logger = new Logger(OfferingService.name);

  constructor(
    @InjectRepository(UploadVersionEntity)
    private readonly uploadVersionRepo: Repository<UploadVersionEntity>,
  ) {}

  async getOfferOfComp(catalogId: string): Promise<ComponentDto>{
    const comp = await this.uploadVersionRepo.findOneBy({catalogId: catalogId});
    if (!comp) {
      this.logger.warn(`Component not found, catalogId ${catalogId}`);
      // todo check way the exception message is not returned
      throw new NotFoundException('Component not found');

    }
    const compRes = ComponentDto.fromUploadVersionEntity(comp);
    return compRes
  }
  
  async checkUpdates(dis: DiscoveryMessageDto): Promise<OfferingResponseDto> {
    const deviceId = dis.general.physicalDevice.ID;
    this.logger.debug(`Create offering for device "${deviceId}"`);
    const offeringRes = new OfferingResponseDto()
    offeringRes.isNewVersion = false;

    const platformName = dis?.softwareData?.platform.name;
    const formation = dis?.softwareData?.formation;
    const OS = dis.general.physicalDevice.OS
    if (!platformName || !formation){
      return offeringRes
    }


    this.logger.debug(`Platform: ${platformName}, Formation: ${formation}`)
    let offered_components  = await this.uploadVersionRepo.find({
      where: {
        platform: platformName,
        formation: formation,
        OS: Raw(() => 'COALESCE(UploadVersionEntity.OS, :value) = :value', {value: OS}),
        uploadStatus: UploadStatus.READY
      }
    });

    for (let comp of offered_components){
      if (!offeringRes.isNewVersion){
        offeringRes.isNewVersion = true;
        offeringRes.platform = new PlatformDto();
        offeringRes.platform.name = platformName;
        offeringRes.platform.components = [];
      }

      const compRes = ComponentDto.fromUploadVersionEntity(comp);

      offeringRes.platform.components.push(compRes)
    }
    this.logger.debug(`Offering for device: "${deviceId}" offering comps: [${offeringRes?.platform?.components.map(comp => comp.catalogId)}]`)
    return offeringRes;

  }

  // private getNewVersion(platform: string, OS: string, formation: string, component: string, currentVersion: string) {
  //   return this.uploadVersionRepo.findOne({
  //     where: {
  //       platform: platform,
  //       formation: formation,
  //       component: component,
  //       OS: Raw(() => 'COALESCE(UploadVersionEntity.OS, :value) = :value', {value: OS}),
  //       version: MoreThan(currentVersion),
  //     },
  //     order: {
  //       version: 'DESC',
  //     },
  //   });
  // }
  // async checkUpdates(dis: DiscoveryMessageDto) {
  //   this.logger.debug('Create offering');
  //   const offeringRes = new OfferingResponseDto()
  //   offeringRes.isNewVersion = false;

  //   const platformName = dis.data.platform.name;
  //   const formation = dis.data.formation;
  //   const OS = dis.general.physicalDevice.OS


  //   this.logger.debug(`Platform: ${platformName}, Formation: ${formation}`)
  //   for (let comp of dis.data.platform.components){
  //     const newVersion = await this.getNewVersion(platformName, OS, formation, comp.name, comp.versionNumber)

  //     if (!newVersion){
  //       this.logger.debug(`No new Version has been found to component: ${comp.name}, version: ${comp.versionNumber}`)
  //       continue;
  //     }
  //     if (!offeringRes.isNewVersion){
  //       offeringRes.isNewVersion = true;
  //       offeringRes.platform = new PlatformDto();
  //       offeringRes.platform.name = platformName;
  //       offeringRes.platform.components = [];
  //     }
  //     this.logger.debug(`New Version has been found to component: ${newVersion.component}, version: ${newVersion.version}`)
  //     const compRes = new ComponentDto()
  //     compRes.id = newVersion.id.toString();
  //     compRes.name = newVersion.component;
  //     compRes.versionNumber = newVersion.version;
  //     compRes.baseVersion = newVersion.baseVersion || "";
  //     compRes.prevVersion = newVersion.prevVersion || "";
  //     compRes.catalogId = newVersion.catalogId;
      
  //     compRes.virtualSize = newVersion.virtualSize;
      
  //     compRes.category = newVersion.metadata?.category;
  //     compRes.releaseNotes = newVersion.metadata?.releaseNote;

  //     compRes.urlPath = await this.s3Service.generatePresignedUrlForDownload(newVersion.s3Url);

  //     offeringRes.platform.components.push(compRes)
  //   }

  //   return offeringRes;
  // }



  // private getPackageStatus(OS: string, formation: string, currentVersion: string, latestVersion: string) {
  //   return this.versionPackageRepo.findOne({
  //     where: {
  //       OS: OS,
  //       formation: formation,
  //       fromVersion: currentVersion,
  //       toVersion: latestVersion,
  //       },
  //     });
  //   }
  
    
  //   private async sendToDelivery(OS: OS, formation: string, currentVersion: string, latestVersion: string){
  //     const packageStatus = await this.getPackageStatus(OS, formation, currentVersion, latestVersion);
  //     if (packageStatus){
  //       this.logger.debug("Offering Already on delivery");
  //     }else {
  //       const pm = new PackageMessageDto(OS, formation, currentVersion, latestVersion);
  //       await validateOrReject(pm)
  
  //       this.logger.debug(`Send to delivery a new packages to be prepare: ${pm}`);
  //       this.offeringMicroClient.emit(
  //         DeliveryTopics.PREPARE_PACKAGE,
  //         pm,
  //       );
  //     }
  //   }

  // // get all component and sub components recursively, if components appear twice takeing the lower version.
  // private getAllComponentVersions(versions: {string: string}, components: ComponentDto[]){
  //   if (!Array.isArray(components)){
  //     return
  //   }
  //   for (const comp of components) {
  //     if(comp.name in versions){
  //       versions[comp.name] = (versions[comp.name] < comp.versionNumber) ? versions[comp.name] : comp.versionNumber;
  //     }else {
  //       versions[comp.name] = comp.versionNumber;
  //     }
  //     this.getAllComponentVersions(versions, comp.subComponents);
  //   }
  // }
  
  // async checkUpdates(dism: DiscoveryMessageDto) {
  //   this.logger.debug('Create offering');
    
  //   const versions = {} as {string: string};
  //   const offeringRes: OfferingResponseDto[]  = [];
  //   const packageMessages: PackageMessageDto[] = [];

  //   const os = dism.general.physicalDevice.OS;

  //   versions[dism.data.baseVersion.name] = dism.data.baseVersion.versionNumber
  
  //   this.getAllComponentVersions(versions, dism.data.baseVersion.components)

  //   this.logger.debug(`Found ${Object.keys(versions).length} components: ${Object.keys(versions)}`)

  //   for (const key in versions){
  //     const newVer = await this.getNewVersion(key, os, versions[key]);

  //     if (newVer == null){
  //       continue
  //     }

  //     let status: string;
  //     let latestVersion = newVer.baseVersion;

  //     const packageStatus = await this.getPackageStatus(os, key, versions[key], latestVersion);

  //     if (packageStatus == null) {
  //       const pm = new PackageMessageDto(os, key, versions[key], latestVersion)
  //       await validateOrReject(pm)
  //       packageMessages.push(pm);

  //       status = 'startingProgress';
  //     } else {
  //       status = packageStatus.status;
  //     }
  //     offeringRes.push(new OfferingResponseDto(os, key, versions[key], latestVersion, status))
  //   }

  //   this.logger.debug(`Send to delivery ${packageMessages.length} new packages to be prepare`);
  //   if (packageMessages.length) {
  //     this.offeringMicroClient.emit(
  //       DeliveryTopics.PREPARE_PACKAGE,
  //       packageMessages,
  //     );
  //   }

  //   this.logger.debug(`Found ${offeringRes.length} packages to offer: ${offeringRes}`);

  //   return offeringRes;
  // }
}
