import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../common";
import { RequestValidator } from "../../validator";

export type TimesheetRequest = {
  project_so: string;
  project_name: string;
  project_id: string;
  resource_name: string;
  resource_id: string;
  task_name: string;
  task_id: string;
  start_time: Date;
  end_time: Date;
  billable: number;
  non_billable: number;
  reason: string;
  description?: string;
  submitted_on: Date;
  status: string;
}

export type ProjectRequest = {
  resource_id: string;
  month: number;
}

export type TaskRequest = {
  resource_id: string;
  project_id: string;
  month: number;
}

export type HoursRequest = {
  resource_id: string;
  project_id: string;
  task_id: string;
  month: number;
}

export class TimesheetValidator {
  public static validateTimesheetRequest(req: unknown): TimesheetRequest {
    const reqObj = RequestValidator.asRecord(req);

    // Ensure `project_so` parameter is correct
    const project_so = RequestValidator.asString(reqObj.project_so, "'project_so' is invalid");

    // Ensure `project_name` parameter is correct
    const project_name = RequestValidator.asString(reqObj.project_name, "'project_name' is invalid");

    // Ensure `project_id` parameter is correct
    const project_id = RequestValidator.asString(reqObj.project_id, "'project_id' is invalid");

    // Ensure `resource_name` parameter is correct
    const resource_name = RequestValidator.asString(reqObj.resource_name, "'resource_name' is invalid");

    // Ensure `resource_id` parameter is correct
    const resource_id = RequestValidator.asString(reqObj.resource_id, "'resource_id' is invalid");

    // Ensure `task_name` parameter is correct
    const task_name = RequestValidator.asString(reqObj.task_name, "'task_name' is invalid");

    // Ensure `task_id` parameter is correct
    const task_id = RequestValidator.asString(reqObj.task_id, "'task_id' is invalid");

    // Ensure `start_time` parameter is correct
    const start_time = RequestValidator.asDate(reqObj.start_time, "'start_time' is invalid");

    // Ensure `end_time` parameter is correct
    const end_time = RequestValidator.asDate(reqObj.end_time, "'end_time' is invalid");

    // Ensure `billable` parameter is correct
    const billable = RequestValidator.asNumber(reqObj.billable, "'billable' is invalid");

    // Ensure `non_billable` parameter is correct
    const non_billable = RequestValidator.asNumber(reqObj.non_billable, "'non_billable' is invalid");

    // Ensure `reason` parameter is correct
    const reason = RequestValidator.asString(reqObj.reason, "'reason' is invalid");

    // Ensure `description` parameter is correct
    const description = RequestValidator.asOptionalString(reqObj.description, "'description' is invalid");

    // Ensure `submitted_on` parameter is correct
    const submitted_on = RequestValidator.asDate(reqObj.submitted_on, "'submitted_on' is invalid");

    return { project_so, project_name, project_id, resource_name, resource_id, task_name, task_id, start_time, end_time, billable, non_billable, reason, description, submitted_on, status: "Pending" };
  }

  public static validateMultipleTimesheetsRequest(req: unknown[]): TimesheetRequest[] {
    const reqArr = RequestValidator.asArray(req, "Input is not an array");
    if (reqArr.every(this.validateTimesheetRequest)) {
      return reqArr.map(this.validateTimesheetRequest) as TimesheetRequest[];
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, "List of timesheets is invalid")
  }

  public static validateProjectRequest(req: unknown): ProjectRequest {
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

  public static validateTaskRequest(req: unknown): TaskRequest {
    const reqObj = RequestValidator.asRecord(req);

    // Ensure `resource_id` parameter is correct
    const resource_id = RequestValidator.asString(reqObj.resource_id, "'resource_id' is invalid");

    // Ensure `project_id` parameter is correct
    const project_id = RequestValidator.asString(reqObj.project_id, "'project_id' is invalid");

    // Ensure `month` parameter is correct
    const month = RequestValidator.asPositiveInteger(reqObj.month, "'month' is invalid");

    // Business logic validation
    if (month > 12) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "month cannot be more than 12");
    }

    return { resource_id, project_id, month };
  }

  public static validateHoursRequest(req: unknown): HoursRequest {
    const reqObj = RequestValidator.asRecord(req);

    // Ensure `resource_id` parameter is correct
    const resource_id = RequestValidator.asString(reqObj.resource_id, "'resource_id' is invalid");

    // Ensure `project_id` parameter is correct
    const project_id = RequestValidator.asString(reqObj.project_id, "'project_id' is invalid");

    // Ensure `task_id` parameter is correct
    const task_id = RequestValidator.asString(reqObj.task_id, "'task_id' is invalid");

    // Ensure `month` parameter is correct
    const month = RequestValidator.asPositiveInteger(reqObj.month, "'month' is invalid");

    // Business logic validation
    if (month > 12) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "month cannot be more than 12");
    }

    return { resource_id, project_id, task_id, month };
  }
}