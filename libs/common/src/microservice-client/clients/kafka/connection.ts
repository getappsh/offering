import { KafkaConfig } from "@nestjs/microservices/external/kafka.interface";
import { readFileSync } from 'fs'

// TODO return only the ssl values
export function getKafkaConnection(clientId?: string): KafkaConfig {
  switch (process.env.DEPLOY_ENV) {
    case "CTS":
      return getConfigCTS(clientId);

    default:
      return getConfigDefault(clientId)

  }
}


function getConfigCTS(clientId?: string): KafkaConfig {
  return {
    clientId: clientId,
    brokers: process.env.KAFKA_BROKER_URL.split(','),
    ssl: {
      rejectUnauthorized: false,
      ca: [readFileSync(process.env.KAFKA_PEM_PATH)],
      key: [readFileSync(process.env.KAFKA_KEY_PATH)],
      cert: [readFileSync(process.env.KAFKA_CERT_PATH)]
    }

  }
}

function getConfigDefault(clientId: string): KafkaConfig {
  return {
    clientId: clientId,
    brokers: process.env.KAFKA_BROKER_URL.split(','),
  }
}
