import { Injectable } from '@nestjs/common';
import { ConsumerHeartbeatEvent } from 'kafkajs';

export class KafkaHealthService {
  private static instance: KafkaHealthService;
  private ready = false;
  private alive = false;
  private lastHeartbeat: number;;

  private constructor() { }

  static getInstance(): KafkaHealthService {
    if (!KafkaHealthService.instance) {
      KafkaHealthService.instance = new KafkaHealthService();

      // Create the stale-heartbeat interval only once, not on every getInstance() call.
      setInterval(() => {
        if (Date.now() - KafkaHealthService.instance.lastHeartbeat > 5000) {
          KafkaHealthService.instance.alive = false;
        }
      }, 5000);
    }

    return KafkaHealthService.instance;
  }

  setHeartbeatEvent(event: ConsumerHeartbeatEvent) {
    this.lastHeartbeat = event.timestamp;
    this.alive = true;
    this.ready = true;
  }

  setFailedEvent(event: any) {
    this.alive = false;
  }

  isReady(): boolean {
    return this.ready
  }
  isAlive(): boolean {
    return this.alive
  }

}
