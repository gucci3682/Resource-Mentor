import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  public readonly statusCode: StatusCodes;

  public constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
