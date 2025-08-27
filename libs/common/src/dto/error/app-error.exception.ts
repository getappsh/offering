import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorDto } from './dto/error';

export class AppErrorException extends HttpException {
  constructor(errorCode: ErrorCode, message: string, httpStatus: HttpStatus = HttpStatus.BAD_REQUEST) {
    const errorDto = new ErrorDto();
    errorDto.errorCode = errorCode;
    errorDto.message = message;
    
    super(errorDto, httpStatus);
  }

  static notFound(errorCode: ErrorCode, message: string): AppErrorException {
    return new AppErrorException(errorCode, message, HttpStatus.NOT_FOUND);
  }

  static conflict(errorCode: ErrorCode, message: string): AppErrorException {
    return new AppErrorException(errorCode, message, HttpStatus.CONFLICT);
  }

  static badRequest(errorCode: ErrorCode, message: string): AppErrorException {
    return new AppErrorException(errorCode, message, HttpStatus.BAD_REQUEST);
  }

  static internalServerError(errorCode: ErrorCode, message: string): AppErrorException {
    return new AppErrorException(errorCode, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
