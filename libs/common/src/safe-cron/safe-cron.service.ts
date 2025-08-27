import { Injectable, Logger, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { JobsEntity } from '@app/common/database/entities/map-updatesCronJob';
import { last } from 'rxjs';

const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

@Injectable()
export class SafeCronService implements OnModuleDestroy {
  private readonly logger = new Logger(SafeCronService.name);
  private acquiredLocks: Map<string, boolean> = new Map();


  constructor(
    @InjectRepository(JobsEntity)
    private readonly jobRepository: Repository<JobsEntity>,
  ) {
    this.registerShutdownHandler();
  }

  /**
   * Attempts to acquire a lock for a specific job
   * @param jobName Name of the job to acquire lock for
   * @returns Promise<boolean> indicating if lock was successfully acquired
   */
  async acquireLock(jobName: string): Promise<boolean> {
    try {
      this.logger.debug(`Attempting to acquire lock for job: ${jobName}`);
      const lockAcquired = await this.tryAcquireJobLock(jobName);
      if (lockAcquired) {
        this.acquiredLocks.set(jobName, true);
      }
      return lockAcquired;
    } catch (error) {
      this.logger.error(
        `Failed to acquire lock for job ${jobName}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Releases the lock for a specific job
   * @param jobName Name of the job to release lock for
   */
  async releaseLock(jobName: string): Promise<void> {
    try {
      this.logger.debug(`Attempting to release lock for job: ${jobName}`);
      await this.releaseJobLock(jobName);
      this.acquiredLocks.delete(jobName);

    } catch (error) {
      this.logger.error(
        `Failed to release lock for job ${jobName}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Checks if a job is currently running
   * @param jobName Name of the job to check
   * @returns Promise<boolean> indicating if job is running
   */
  private async isJobRunning(jobName: string): Promise<boolean> {
    const lastJob = await this.findLastJob(jobName);
    
    if (!lastJob) {
      return false;
    }

    const isExpired = this.isLockExpired(lastJob.startTime);
    const isCompleted = !!lastJob.endTime;

    if (isExpired || isCompleted) {
      return false;
    }

    return true;
  }

  /**
   * Attempts to acquire a lock for a job
   * @param jobName Name of the job
   * @returns Promise<boolean> indicating if lock was acquired
   */
  private async tryAcquireJobLock(jobName: string): Promise<boolean> {
    const isRunning = await this.isJobRunning(jobName);

    if (isRunning) {
      this.logger.warn(`Job ${jobName} is already running`);
      return false;
    }

    try {
      const job = this.jobRepository.create({
        name: jobName,
        startTime: new Date(),
      });

      await this.jobRepository.save(job);
      this.logger.log(`Successfully acquired lock for job: ${jobName}`);
      return true;
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        this.logger.warn(`Concurrent lock attempt detected for job: ${jobName}`);
        return false;
      }
      throw error;
    }
  }

  async updateJobStartTime(jobName: string): Promise<void> {
    const isRunning = await this.isJobRunning(jobName);
    if (!isRunning){
      return;
    }
    try{
      const lastJob = await this.findLastJob(jobName);
      if (!lastJob.endTime){
        lastJob.startTime = new Date();
        await this.jobRepository.save(lastJob);
      }else{
        this.logger.warn(`No running job found to update start time for: ${jobName}`);
      }
    
    }catch(error){ 
      this.logger.error(`Failed to update start time for job ${jobName}: ${error.message}`, error.stack);
    }
  }
  
  /**
   * Releases a job's lock by setting its end time
   * @param jobName Name of the job
   */
  private async releaseJobLock(jobName: string): Promise<void> {
    const lastJob = await this.findLastJob(jobName);
    
    if (!lastJob) {
      this.logger.warn(`No running job found to release lock for: ${jobName}`);
      return;
    }

    lastJob.endTime = new Date();
    await this.jobRepository.save(lastJob);
    this.logger.log(`Successfully released lock for job: ${jobName}`);
  }

  /**
   * Finds the most recent job entry
   * @param jobName Name of the job
   * @returns Promise<JobsEntity | null>
   */
  private async findLastJob(jobName: string): Promise<JobsEntity | null> {
    return await this.jobRepository.findOne({
      where: { name: jobName },
      order: { startTime: 'DESC' },
    });
  }

  /**
   * Checks if a lock has expired based on start time
   * @param startTime The start time to check
   * @returns boolean indicating if lock has expired
   */
  private isLockExpired(startTime: Date): boolean {
    return Date.now() - startTime.getTime() > LOCK_TIMEOUT_MS;
  }


  private async handleShutdown(): Promise<void> {
    for (const taskId of this.acquiredLocks.keys()) {
      await this.releaseLock(taskId);
    }
  }

  private registerShutdownHandler(): void {
    process.on('exit', async () => await this.handleShutdown());
    process.on('SIGINT', async () => {
      await this.handleShutdown();
      process.exit();
    });
    process.on('SIGTERM', async () => {
      await this.handleShutdown();
      process.exit();
    });
  }

  async onModuleDestroy() {
    await this.handleShutdown();
  }
}