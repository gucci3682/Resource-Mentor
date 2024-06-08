import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../common";
import { RequestValidator } from "../../validator";

export type PiechartRequest = {
  resource_id: string;
  month: number;
}

export class DashboardValidator {
  public static validatePieChartRequest(req: unknown): PiechartRequest {
    const reqObj = RequestValidator.asRecord(req);

    // Ensure `resource_id` parameter is correct
    const resource_id = RequestValidator.asString(reqObj.resource_id, "'resource_id' is invalid");

    // Ensure `month` parameter is correct
    const month = RequestValidator.asPositiveInteger(reqObj.month, "'month' is invalid");

    // Business logic validation
    if (month > 12) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "month cannot be more than 12");
    }

    return { resource_id, month };    
  }
}
