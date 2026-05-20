/**
 * Emitted by sbom-generator when a scan finishes (success or failure).
 * Upload service subscribes to link the report bucket path to the artifact.
 */
export class ScanCompletedEventDto {
  /** The scan job ID. */
  scanId: string;

  /** The MinIO object key of the generated SBOM report (set on success, null on failure). */
  reportBucketPath: string | null;

  /** Whether the scan completed successfully. */
  success: boolean;

  /** Error message if the scan failed. */
  error?: string;
}
