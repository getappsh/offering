import { HttpStatus, Logger } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { AppError } from './dto/error';

/**
 * RxJS operator that deserializes RPC errors in an observable pipe.
 * Use this with RxJS observables to automatically transform serialized errors.
 * 
 * @example
 * ```typescript
 * this.client.send(topic, data).pipe(
 *     catchRpcError()
 * );
 * ```
 */
export function catchRpcError<T>() {
  return (source: Observable<T>) => source.pipe(
    catchError(error => throwError(() => handleRpcError(error)))
  );
}

/**
 * RPC error deserializer that transforms serialized errors from microservice calls
 * back to their original typed instances (AppError or standard Error).
 * 
 * This function acts as a pure pipe/parser that handles various RPC serialization formats:
 * - String-serialized JSON errors
 * - Nested JSON message structures
 * - Object-based error messages with errorCode property
 * 
 * @param error - The serialized error caught from an RPC call
 * @returns AppError | Error - The deserialized error instance
 * 
 * @example
 * ```typescript
 * try {
 *   await lastValueFrom(this.client.send(topic, data));
 * } catch (error) {
 *   throw handleRpcError(error);
 * }
 * ```
 */
export function handleRpcError(error: any): AppError | Error {
  const logger = new Logger('RpcErrorHandler');
  
  try {
    // Try to parse the entire error object as JSON string first
    if (typeof error === 'string') {
      logger.debug(`Error is a string, attempting to parse...`);
      const parsedError = JSON.parse(error);
      
      // Check for nested message string
      if (parsedError.message && typeof parsedError.message === 'string') {
        try {
          const innerParsed = JSON.parse(parsedError.message);
          if (innerParsed.errorCode) {
            logger.debug(`Deserialized AppError: ${innerParsed.errorCode}`);
            return new AppError(
              innerParsed.errorCode,
              innerParsed.message,
              innerParsed.code || innerParsed.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
              innerParsed.error_data?.data || innerParsed.data
            );
          }
        } catch {
          // Not nested JSON, continue
        }
      }
      
      // Check direct parsed error for AppError
      if (parsedError.errorCode) {
        logger.debug(`Deserialized AppError: ${parsedError.errorCode}`);
        return new AppError(
          parsedError.errorCode,
          parsedError.message,
          parsedError.code || parsedError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          parsedError.error_data?.data || parsedError.data
        );
      }
    }
    
    // Check if error.message is a JSON string
    if (error?.message && typeof error.message === 'string') {
      try {
        logger.debug(`error.message is a string, attempting to parse...`);
        const parsedError = JSON.parse(error.message);
        
        if (parsedError.errorCode) {
          logger.debug(`Deserialized AppError from message: ${parsedError.errorCode}`);
          return new AppError(
            parsedError.errorCode,
            parsedError.message,
            parsedError.code || parsedError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            parsedError.error_data?.data || parsedError.data
          );
        }
      } catch {
        // Not JSON, continue
      }
    }
    
    // Check if error.message is an object with errorCode (AppError)
    if (error?.message && typeof error.message === 'object' && "errorCode" in error.message) {
      logger.debug(`Deserialized AppError from message object: ${error.message.errorCode}`);
      return new AppError(
        error.message.errorCode,
        error.message.message || error.message.errorMessage,
        error.message.statusCode || error.message.code || HttpStatus.INTERNAL_SERVER_ERROR,
        error.message.data
      );
    }
    
    // Check if error itself has errorCode (already AppError)
    if (error?.errorCode) {
      logger.debug(`Already AppError: ${error.errorCode}`);
      return error instanceof AppError ? error : new AppError(
        error.errorCode,
        error.message,
        error.statusCode || error.code || HttpStatus.INTERNAL_SERVER_ERROR,
        error.data
      );
    }
    
  } catch (parseError) {
    logger.debug(`Failed to deserialize RPC error: ${parseError.message}`);
  }
  
  // Return original error if can't deserialize to AppError
  logger.debug(`Cannot deserialize to AppError, returning as standard Error`);
  return error instanceof Error ? error : new Error(
    error?.message || (typeof error === 'string' ? error : 'Unknown error')
  );
}
