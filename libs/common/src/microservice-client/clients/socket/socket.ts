import { ClientProvider, Transport } from "@nestjs/microservices";
import { MicroserviceType } from "../../microservice-client.interface";

export function getSocketClientConfig(type: MicroserviceType): ClientProvider {
  switch (type) {
    case MicroserviceType.DELIVERY:
      return socketDeliveryConfig()
    case MicroserviceType.DEPLOY:
      return socketDeployConfig()
    case MicroserviceType.DISCOVERY:
      return socketDiscoveryConfig()
    case MicroserviceType.OFFERING:
      return socketOfferingConfig()
    case MicroserviceType.PROJECT_MANAGEMENT:
      return socketProjectManagementConfig()
    case MicroserviceType.UPLOAD:
      return socketUploadConfig()
    case MicroserviceType.GET_MAP:
      return socketGetMapConfig()
    case MicroserviceType.DEVICE:
      // For device using discovery microservice
      return socketDiscoveryConfig()
    case MicroserviceType.MICRO_DISCOVERY:
      // Using the offering microservice
      return socketOfferingConfig()

  }
}

const socketDeliveryConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP,
    options: { 
      host: process.env.DELIVERY_HOST?? "localhost",
      port: Number(process.env.DELIVERY_PORT?? 3001) 
    }
  }
}

const socketDeployConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP,
    options: { 
      host: process.env.DEPLOY_HOST?? "localhost",
      port: Number(process.env.DEPLOY_PORT?? 3002)
     }
  }
}

const socketDiscoveryConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP,
    options: { 
      host: process.env.DISCOVERY_HOST?? "localhost",
      port: Number(process.env.DISCOVERY_PORT?? 3003) 
    }
  }
}

const socketOfferingConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP,
    options: { 
      host: process.env.OFFERING_HOST?? "localhost",
      port: Number(process.env.OFFERING_PORT?? 3004)
     }
  }
}

const socketProjectManagementConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP,
    options: { 
      host: process.env.PROJECT_HOST?? "localhost",
      port: Number(process.env.PROJECT_PORT?? 3005) 
    }
  }
}

const socketUploadConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP,
    options: { 
      host: process.env.UPLOAD_HOST?? "localhost",
      port: Number(process.env.UPLOAD_PORT?? 3006) 
    }
  }
}

const socketGetMapConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP,
    options: { 
      host: process.env.GETMAP_HOST?? "localhost",
      port: Number(process.env.GETMAP_PORT?? 3007) 
    }
  }
}

// const socketDeviceConfig = (): ClientProvider => {
//   return {
//     transport: Transport.TCP ,
//     options: {port: 3008}
//   }
// }