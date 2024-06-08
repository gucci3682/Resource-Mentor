import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../common";
import { RequestValidator } from "../../validator";

export type HistoryRequest = {
  resource_id: string;
  month?: number;
}

export class HistoryValidator {
  public static validateHistoryRequest(req: unknown): HistoryRequest {
    const reqObj = RequestValidator.asRecord(req);
    
    // Ensure `resource_id` parameter is correct
    const resource_id = RequestValidator.asNonEmptyString(reqObj.resource_id, "resource_id is invalid");

    // Ensure `month` parameter is correct
    const month = RequestValidator.asOptionalPositiveInteger(reqObj.month, "'month' is invalid");

    // Business logic validation
    if (month && month > 12) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "month cannot be more than 12");
    }

    return { resource_id };
  }
}
