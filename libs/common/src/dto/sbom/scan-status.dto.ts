export enum ScanStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

export class ScanStatusDto {
  /** Scan job UUID. */
  id: string;

  /** Current status of the scan. */
  status: ScanStatus;

  /** Scan target (image name, file path, registry URL, etc.) */
  target: string;

  /** Type of the scan target. */
  targetType: string;

  /** SBOM output format. */
  format: string;

  /** Who or what triggered this scan. */
  triggeredBy?: string;

  /** Error message if the scan failed. */
  error?: string;

  /** Short reason code for the failure. */
  failureReason?: string;

  /** Timestamp when the scan was created. */
  createdAt: Date;

  /** Timestamp of the last status update. */
  updatedAt: Date;

  /** Timestamp when the scan reached a terminal state. */
  completedAt?: Date;
}
