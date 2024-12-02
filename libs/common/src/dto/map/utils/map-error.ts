import { ErrorCode } from "@app/common/dto/error";

export class MapError extends Error {
  errorCode: ErrorCode
  constructor(errorCode: ErrorCode, mes: string) {
    super(mes)
    this.errorCode = errorCode

    Object.setPrototypeOf(this, MapError.prototype);
  }
}