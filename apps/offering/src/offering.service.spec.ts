import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OfferingService } from './offering.service';
import { S3Service } from '@app/common/AWS/s3.service';
import { UploadStatus, UploadVersionEntity } from '@app/common/database/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComponentDto, PlatformDto } from '@app/common/dto/discovery';
import { OfferingResponseDto } from '@app/common/dto/offering';
import { mockUploadVersionRepo } from '@app/common/database/test/support/__mocks__';
import { uploadVersionEntityStub } from '@app/common/database/test/support/stubs';
import { discoveryMessageDtoStub } from '@app/common/dto/discovery';

describe('OfferingService', () => {
  let offeringService: OfferingService;
  let uploadVersionRepo: Repository<UploadVersionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferingService,
        {
          provide: getRepositoryToken(UploadVersionEntity),
          useValue: mockUploadVersionRepo(),
        },
      ],
    }).compile();

    offeringService = module.get<OfferingService>(OfferingService);
    uploadVersionRepo = module.get<Repository<UploadVersionEntity>>(getRepositoryToken(UploadVersionEntity));

    jest.clearAllMocks();

  });

  describe('getOfferOfComp', () => {
    it('should return component DTO if component exists', async () => {
      const comp = uploadVersionEntityStub();
      const catalogId = comp.catalogId;

      const result = await offeringService.getOfferOfComp(catalogId);
      
      expect(result).toBeInstanceOf(ComponentDto);
      expect(result.catalogId).toBe(catalogId);
      expect(uploadVersionRepo.findOneBy).toHaveBeenCalledWith({ catalogId });
    });

    it('should throw NotFoundException if component does not exist', async () => {
      const catalogId = 'non-existent-catalog-id';
      jest
        .spyOn(uploadVersionRepo, 'findOneBy')
        .mockResolvedValueOnce(undefined);

      await expect(offeringService.getOfferOfComp(catalogId)).rejects.toThrowError(
        NotFoundException,
      );
      expect(uploadVersionRepo.findOneBy).toHaveBeenCalledWith({ catalogId });
    });
  });

  describe('checkUpdates', () => {
    it('should return offering response DTO with existing components', async () => {
      const disc = discoveryMessageDtoStub()

      const result = await offeringService.checkUpdates(disc);

      expect(result).toBeInstanceOf(OfferingResponseDto);
      expect(result.isNewVersion).toBe(true);
      expect(result.platform).toBeInstanceOf(PlatformDto);
      expect(result.platform.components.every(item => item instanceof ComponentDto)).toBe(true);
      expect(uploadVersionRepo.find).toHaveBeenCalledWith({
        where: {
          platform: disc.softwareData.platform.name,
          formation: disc.softwareData.formation,
          // OS: Raw(() => 'COALESCE(UploadVersionEntity.OS, :value) = :value', {value: disc.general.physicalDevice.OS}),
          OS: expect.anything(),
          uploadStatus: UploadStatus.READY,
        },
      });
    });

    it('should return offering response DTO with no components (case 1)', async () => {
      const disc = discoveryMessageDtoStub()
      delete disc.softwareData.platform.name
      
      const result = await offeringService.checkUpdates(disc);

      expect(result).toBeInstanceOf(OfferingResponseDto);
      expect(result.isNewVersion).toBe(false);
      expect(result.platform).toBeUndefined();
      expect(result.platform?.name).toBeUndefined();
      expect(result.platform?.components).toBeUndefined();
      expect(uploadVersionRepo.find).not.toHaveBeenCalled();
    });

    it('should return offering response DTO with no components (case 2)', async () => {
      const disc = discoveryMessageDtoStub()
      delete disc.softwareData.formation
      
      const result = await offeringService.checkUpdates(disc);

      expect(result).toBeInstanceOf(OfferingResponseDto);
      expect(result.isNewVersion).toBe(false);
      expect(result.platform).toBeUndefined();
      expect(result.platform?.name).toBeUndefined();
      expect(result.platform?.components).toBeUndefined();
      expect(uploadVersionRepo.find).not.toHaveBeenCalled();
    });

    it('should return offering response DTO with no components (case 3)', async () => {
      const disc = discoveryMessageDtoStub()
      jest
        .spyOn(uploadVersionRepo, 'find')
        .mockResolvedValueOnce([]);

      const result = await offeringService.checkUpdates(disc);

      expect(result).toBeInstanceOf(OfferingResponseDto);
      expect(result.isNewVersion).toBe(false);
      expect(result.platform).toBeUndefined();
      expect(result.platform?.name).toBeUndefined();
      expect(result.platform?.components).toBeUndefined();
      expect(uploadVersionRepo.find).toHaveBeenCalledWith({
        where: {
          platform: disc.softwareData.platform.name,
          formation: disc.softwareData.formation,
          // OS: Raw(() => 'COALESCE(UploadVersionEntity.OS, :value) = :value', {value: disc.general.physicalDevice.OS}),
          OS: expect.anything(),
          uploadStatus: UploadStatus.READY,
        },
      });
    });
  });
});
