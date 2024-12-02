import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OfferingService } from './offering.service';
import { OfferingTopics } from '@app/common/microservice-client/topics';
import { DiscoveryMessageDto } from '@app/common/dto/discovery';

@Controller()
export class OfferingController {

  private readonly logger = new Logger(OfferingController.name);

  constructor(private readonly offeringService: OfferingService) {}
  

  @MessagePattern(OfferingTopics.GET_OFFER_OF_COMP)
  getOfferOfComp(@Payload("stringValue") catalogId: string){    
    this.logger.debug(`get offering for comp: ${catalogId}`)
    return this.offeringService.getOfferOfComp(catalogId)
  }

  @MessagePattern(OfferingTopics.CHECK_UPDATES)
  checkUpdates(@Payload() data: DiscoveryMessageDto){    
    return this.offeringService.checkUpdates(data)
  }

  @MessagePattern(OfferingTopics.CHECK_HEALTH)
  healthCheckSuccess(){
    return "Offering service is success"
  }

}
