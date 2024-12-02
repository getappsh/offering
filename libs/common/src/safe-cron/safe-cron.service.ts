import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobsEntity } from '@app/common/database/entities/map-updatesCronJob';

const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

@Injectable()
export class SafeCronService {
  private readonly logger = new Logger(SafeCronService.name);

  constructor(
    @InjectRepository(JobsEntity)
    private readonly jobRepository: Repository<JobsEntity>,
  ) {}

  /**
   * Attempts to acquire a lock for a specific job
   * @param jobName Name of the job to acquire lock for
   * @returns Promise<boolean> indicating if lock was successfully acquired
   */
  async acquireLock(jobName: string): Promise<boolean> {
    try {
      this.logger.debug(`Attempting to acquire lock for job: ${jobName}`);
      return await this.tryAcquireJobLock(jobName);
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

    this.logger.warn(`Job ${jobName} is already running`);
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
}