import { RequestValidator } from "../../validator";
import { ApiError } from "../../common";
import { StatusCodes } from "http-status-codes";

export type GetProjectsRequest = {
  resource_id: string;
  month?: number;
}

export type GetTasksRequest = {
  resource_id: string;
  project_id: string;
  month?: number;
}

export class ProjectsValidator {
  public static validateGetProjectsRequest(req: unknown): GetProjectsRequest {
    const reqObj = RequestValidator.asRecord(req);
    
    // Ensure `resource_id` parameter is correct
    const resource_id = RequestValidator.asString(reqObj.resource_id, "'resource_id' is invalid");

    // Ensure `month` parameter is correct
    const month = RequestValidator.asOptionalPositiveInteger(reqObj.month, "'month' is invalid");

    // Business logic validation
    if (month && month > 12) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "month cannot be more than 12");
    }

    return { resource_id, month };
  }

  public static validateGetTasksRequest(req: unknown): GetTasksRequest {
    const reqObj = RequestValidator.asRecord(req);
    
    // Ensure `resource_id` parameter is correct
    const resource_id = RequestValidator.asString(reqObj.resource_id, "'resource_id' is invalid");

    // Ensure `project_id` parameter is correct
    const project_id = RequestValidator.asString(reqObj.project_id, "'project_id' is invalid");

    // Ensure `month` parameter is correct
    const month = RequestValidator.asOptionalPositiveInteger(reqObj.month, "'month' is invalid");

    // Business logic validation
    if (month && month > 12) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "month cannot be more than 12");
    }

    return { resource_id, project_id, month };
  }
}