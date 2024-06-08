import { StatusCodes } from "http-status-codes";
import { ApiError } from "../common/ApiError";

export class RequestValidator {
  public static asRecord(arg: unknown, errorMessage = "Unknown error occurred"): Record<string, unknown> {
    if (arg != null && typeof arg === "object" && !Array.isArray(arg)) {
      return arg as Record<string,unknown>;
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static asArray(arg: unknown, errorMessage: string): unknown[] {
    if (arg != null && typeof arg ==="object" && Array.isArray(arg)) {
      return arg as unknown[];
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static asOptionalRecord(arg: unknown, errorMessage = "Unknown error occurred"): Record<string, unknown> | undefined {
    return arg == null ? undefined : this.asRecord(arg, errorMessage);
  }

  public static asString(arg: unknown, errorMessage: string): string {
    if (typeof arg === "string") {
      return arg;
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
    }

  public static asOptionalString(arg: unknown, errorMessage: string): string | undefined {
    return arg == null ? undefined : this.asString(arg, errorMessage);
  }

  public static asNonEmptyString(arg: unknown, errorMessage:string): string {
    const parsed = this.asString(arg, errorMessage);
    if (parsed.length > 0) {
      return parsed;
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static asNumber(arg: unknown, errorMessage: string): number {
    if (typeof arg === "number") {
      return arg;
    } else if (typeof arg === "string") {
      const parsed = Number(arg);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static asPositiveNumber(arg: unknown, errorMessage: string): number {
    const parsed = this.asNumber(arg, errorMessage);
    if (parsed > 0) {
      return parsed;
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static asOptionalPositiveInteger(arg: unknown, errorMessage: string): number | undefined {
    return arg == null ? undefined : this.asPositiveInteger(arg, errorMessage);
  }

  public static asInteger(arg: unknown, errorMessage: string): number {
    const parsed = this.asNumber(arg, errorMessage);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static asPositiveInteger(arg: unknown, errorMessage: string): number {
    const parsed = this.asPositiveNumber(arg, errorMessage);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static asDate(arg: unknown, errorMessage: string): Date {
    /** The Date constructor will never throw any errors
     *  but takes null / undefined as minimum (zeroth) timestamp
     */
    if (arg == null || typeof arg === "boolean" || Array.isArray(arg)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
    }

    const parsed = new Date(arg as any);
    if (Number.isFinite(parsed.valueOf())) {
      return parsed;
    }
    // Handle Unix timestamp strings
    const parsedNumber = this.asNumber(arg, errorMessage);
    return new Date(parsedNumber);
  }

  public static asBoolean(arg: unknown, errorMessage: string): boolean {
    if (typeof arg === "boolean") {
      return arg;
    } else if (typeof arg === "string" && (arg === "true" || arg === "false")) {
      return arg === "true";
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  public static isValidRange<T>(first: T, second: T, inclusive = false): boolean {
    return inclusive ? first <= second : first < second;
  }

  public static isStrictEqual<T>(first: T, second: T): boolean {
    return first === second;
  }
}
