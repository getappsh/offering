import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import stream from 'stream';
import { PassThrough } from 'stream';
import { CosignSignatureService } from './cosign-signature.service';
import { Sha256Service } from './sha256.service';

export interface FileProcessingOptions {
  /** Whether to calculate SHA256 hash. Defaults to true if not specified */
  calculateSha256?: boolean;
  /** Whether to calculate Cosign signature. Defaults to false if not specified */
  calculateCosign?: boolean;
}

export interface FileProcessingResult {
  sha256?: string;
  cosignSignature?: Buffer;
}

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);
  private readonly cosignService: CosignSignatureService;
  private readonly sha256Service: Sha256Service;

  constructor(private readonly configService: ConfigService) {
    this.cosignService = new CosignSignatureService(configService);
    this.sha256Service = new Sha256Service();
  }

  /**
   * Process a file stream to calculate SHA256 hash and/or Cosign signature
   * Efficiently handles both operations from a single stream by splitting it when needed
   * 
   * @param fileStream - The readable stream of the file to process
   * @param options - Options to specify what to calculate (sha256, cosign, or both)
   * @returns Promise with the requested calculations
   */
  async processFile(
    fileStream: stream.Readable,
    options: FileProcessingOptions = {}
  ): Promise<FileProcessingResult> {
    // Default: SHA256 is calculated unless explicitly set to false, Cosign is not calculated unless explicitly set to true
    const calculateSha256 = options.calculateSha256 !== false;
    const calculateCosign = options.calculateCosign === true;

    if (!calculateSha256 && !calculateCosign) {
      throw new BadRequestException('At least one processing option must be enabled');
    }

    // If only one operation is needed, process directly without stream splitting
    if (calculateSha256 && !calculateCosign) {
      const sha256 = await this.sha256Service.calculateSha256(fileStream);
      return { sha256 };
    }

    if (calculateCosign && !calculateSha256) {
      const cosignSignature = await this.cosignService.signFile(fileStream);
      return { cosignSignature };
    }

    // Both operations needed - split the stream efficiently
    return this.processFileWithBothOperations(fileStream);
  }

  /**
   * Process file with both SHA256 and Cosign signature by splitting the stream
   */
  private async processFileWithBothOperations(
    sourceStream: stream.Readable
  ): Promise<FileProcessingResult> {
    this.logger.debug('Processing file with both SHA256 and Cosign signature');

    // Create two PassThrough streams to split the original stream
    const sha256Stream = new PassThrough();
    const cosignStream = new PassThrough();

    // Start both operations in parallel
    const sha256Promise = this.sha256Service.calculateSha256(sha256Stream);
    const cosignPromise = this.cosignService.signFile(cosignStream);

    // Pipe the source stream to both PassThrough streams
    sourceStream.on('data', (chunk) => {
      sha256Stream.write(chunk);
      cosignStream.write(chunk);
    });

    sourceStream.on('end', () => {
      sha256Stream.end();
      cosignStream.end();
    });

    sourceStream.on('error', (error) => {
      sha256Stream.destroy(error);
      cosignStream.destroy(error);
    });

    try {
      // Wait for both operations to complete
      const [sha256, cosignSignature] = await Promise.all([sha256Promise, cosignPromise]);
      return { sha256, cosignSignature };
    } catch (error) {
      this.logger.error('Error processing file with both operations', error);
      throw error;
    }
  }
}
