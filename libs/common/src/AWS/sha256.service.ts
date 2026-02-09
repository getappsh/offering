import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import stream from 'stream';

@Injectable()
export class Sha256Service {
  private readonly logger = new Logger(Sha256Service.name);

  /**
   * Calculate SHA256 hash from a stream
   * @param fileStream - The readable stream of the file to hash
   * @returns Promise that resolves to the hex-encoded SHA256 hash
   */
  async calculateSha256(fileStream: stream.Readable): Promise<string> {
    this.logger.debug('Calculating SHA256 hash');
    const hash = createHash('sha256');

    return new Promise<string>((resolve, reject) => {
      fileStream.on('data', (chunk) => hash.update(chunk));
      fileStream.on('end', () => {
        const hashValue = hash.digest('hex');
        this.logger.debug(`SHA256 hash calculated: ${hashValue}`);
        resolve(hashValue);
      });
      fileStream.on('error', (error) => {
        this.logger.error('Error calculating SHA256 hash', error);
        reject(error);
      });
    });
  }
}
