import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tmpdir } from 'os';
import { mkdtempSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import stream from 'stream';

@Injectable()
export class CosignSignatureService {
  private readonly logger = new Logger(CosignSignatureService.name);
  private readonly privateKeyPath: string;
  private readonly publicKeyPath: string;
  private readonly password: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    try{
      this.password = this.configService.getOrThrow<string>('COSIGN_PASSWORD'); 
      this.privateKeyPath = this.configService.getOrThrow<string>('COSIGN_PRIVATE_KEY_PATH');
      this.publicKeyPath = this.configService.getOrThrow<string>('COSIGN_PUBLIC_KEY_PATH');
    } catch (error) {
      this.logger.error('Missing required COSIGN configuration environment variables.', error);
    }
  }

  async signFile(fileStream: stream.Readable): Promise<Buffer> {
    this.logger.debug(`Signing file`);

    const env = { ...process.env};
    env.COSIGN_PASSWORD = this.password;

    return new Promise<Buffer>((resolve, reject) => {
      const cosign = spawn('cosign', ['sign-blob', '-', '--key', this.privateKeyPath,  "--tlog-upload=false"], { env });
    
      let signature = Buffer.alloc(0);

      cosign.stdout.on('data', (chunk) => {
        this.logger.log(`Received chunk of size: ${chunk.length}`);
        signature = Buffer.concat([signature, chunk]);
      });

      cosign.stderr.on('data', (chunk) => this.logger.warn(chunk.toString()));

      cosign.on('exit', (code) => {
        if (code === 0) resolve(signature);
        else reject(new Error(`Cosign exited with code ${code}`));
      });

      // Pipe MinIO file stream into Cosign stdin
      fileStream.pipe(cosign.stdin);
      fileStream.on('error', (err) => reject(err));
    });
  }


  async verifySignature(fileStream: stream.Readable, signature: string): Promise<boolean> {
    this.logger.debug(`Verifying signature for file`);
    
    const env = { ...process.env};
    env.COSIGN_PASSWORD = this.password;
    
    return new Promise<boolean>((resolve, reject) => {
      
      const dir = mkdtempSync(join(tmpdir(), 'cosign-'));
      const tmpFilePath = join(dir, 'sigfile.sig');
      writeFileSync(tmpFilePath, signature);
      this.logger.log(`Temporary signature file created at: ${tmpFilePath}`);

      const cosign = spawn('cosign', ['verify-blob', '-', '--key', this.publicKeyPath, '--signature', tmpFilePath, "--insecure-ignore-tlog=true"], { env });

      let verificationOutput = '';
      let verificationError = '';

      cosign.stdout.on('data', (chunk) => {
        verificationOutput += chunk.toString();
      });

      cosign.stderr.on('data', (chunk) => {
        verificationError += chunk.toString();
        this.logger.warn(chunk.toString());
      });

      cosign.on('exit', (code) => {
        unlinkSync(tmpFilePath);
        if (code === 0) {
          this.logger.log(`Verification succeeded: ${verificationOutput}`);
          resolve(true);
        } else {
          this.logger.error(`Verification failed with code ${code}: ${verificationError}`);
          resolve(false);
        }
      });

      fileStream.pipe(cosign.stdin);
      fileStream.on('error', (err) => reject(err));
    });
  }
}
