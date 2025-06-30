import { applyDecorators, Inject } from "@nestjs/common";
import { Timeout } from "@nestjs/schedule";
import { SafeCronService } from "./safe-cron.service";

/**
 * Options for configuring a task with an initial timeout and optional repeated execution.
 *
 * @interface TimeoutRepeatTaskOptions
 * 
 * @property {string} name - The unique name of the task.
 * @property {number} initialTimeout - The initial delay before the task is executed, in milliseconds.
 * @property {number} [repeatTimeout] - Optional. The interval between repeated executions of the task, in milliseconds. Defaults to 10 seconds. 
 * @property {number} [acquireFailTimeout] - Optional. The delay before retrying the task if it fails to acquire necessary resources, in milliseconds. Defaults to 1 hour.
 */
export interface TimeoutRepeatTaskOptions {
  name: string;
  initialTimeout: number;
  repeatTimeout?: number;
  acquireFailTimeout?: number;
}

/** 
 * This decorator is used to run a task on a given timeout that will be repeated when task fails/finishes after a certain amount of time
 * If the lock is not acquired, the task will be scheduled to run again in 1 hour
 */ 
export function TimeoutRepeatTask(options: TimeoutRepeatTaskOptions) {
  return applyDecorators(
    TimeoutRepeatTaskInjector(options),
    Timeout(options.initialTimeout),
  );
}

function TimeoutRepeatTaskInjector(options: TimeoutRepeatTaskOptions) {
  const injectCronLocker = Inject(SafeCronService);

  return (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    injectCronLocker(target, 'locker');

    descriptor.value = async function (...args: any[]) {
      const locker: SafeCronService = this.locker;

      const runTask = async () => {
        if (await locker.acquireLock(options.name)) {
          const interval = setInterval(() => locker.updateJobStartTime(options.name), 1000 * 60 * 4); // 4 minutes
          try {
            await originalMethod.apply(this, args);
          }catch (err) {
            this.logger.error(`Error running task: ${err}`);
          } finally {
            clearInterval(interval);
            await locker.releaseLock(options.name);
            setTimeout(runTask, options.repeatTimeout || 1000 * 10) // 10 seconds;
          }
        }
        setTimeout(runTask, options.acquireFailTimeout || 1000 * 60 * 60); // 1 hour
      };

      runTask();
    };

    return descriptor;
  };
}
