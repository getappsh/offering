import { applyDecorators, Inject } from "@nestjs/common";
import { Cron, CronOptions } from "@nestjs/schedule";
import { SafeCronService } from "./safe-cron.service";
import { DateTime } from 'luxon';


export interface SafeCronOptions extends Omit<CronOptions, 'name'> {
  name: string;
  cronTime: string | Date | DateTime;
}

export function SafeCron(options: SafeCronOptions) {  
  return applyDecorators(
    SafeCronInjector(options.name),
    Cron(options.cronTime, options as unknown as CronOptions), 
  );
}

function SafeCronInjector(name: string){
  const injectCronLocker = Inject(SafeCronService);

  return (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {  
    const originalMethod = descriptor.value;
    injectCronLocker(target, 'locker');
    
    descriptor.value = async function (...args: any[]) {
      const locker: SafeCronService = this.locker;

      if (await locker.acquireLock(name)){
        try{
          await originalMethod.apply(this, args);

        }finally{
          await locker.releaseLock(name);
        }
        
      }    
    };

    return descriptor;
  };
};
