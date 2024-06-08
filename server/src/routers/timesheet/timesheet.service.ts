import { UUID } from "crypto";
import { StatusCodes } from "http-status-codes";
import { pgDatabase } from "../../Database";
import { 
  createMultipleTimesheets, 
  createTimesheet, 
  getProjectByResource, 
  getTaskByProjectResource, 
  getHoursByTaskProjectResource,
  getTotalClockedHoursByTask 
} from "../../Database/queries";
import { ProjectRequest, TimesheetRequest, TaskRequest, HoursRequest } from "./timesheet.validator";
import { ApiError } from "../../common";

export type TimesheetResponse = {
  timesheet_id: UUID;
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
  submitted_on: Date
  status: string;
}

export type ProjectResponse = {
  project_id: string;
  project_so: string;
  project_name: string;
}

export type TaskResponse = {
  task_id: string;
  task_name: string;
}

export type HoursResponse = {
  allocated: number;
  approved: number;
  pending: number;
}

export type TotalClockedHoursByTaskResponse = {
  total_clocked: number;
}
export class TimesheetService {
  public static land() {
    return "My Timesheet";
  }

  public static async createTimesheet(req: TimesheetRequest): Promise<TimesheetResponse> {
    try {
      const result = await pgDatabase.query(
        createTimesheet,
        false,
        Object.values(req)
      ).then(x => { return x[0] });
      console.log("Timesheet created successfully: ", result);
      return result;
    } catch (err) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating timesheet");
    }
  }

  public static async createMultipleTimesheets(req: TimesheetRequest[]): Promise<TimesheetResponse[]> {
    try {
      const result = await pgDatabase.query(
        createMultipleTimesheets, 
        true,
        req.map(Object.values)
      ).then(x => { return x });
      console.log("Timesheets created successfully: ", result);
      return result;
    } catch (err) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating timesheets");
    }
  }

  public static async getProjectByResource(req: ProjectRequest): Promise<ProjectResponse[]> {
    try {
      const result = await pgDatabase.query(
        getProjectByResource,
        false,
        Object.values(req)
      ).then(x => { return x });
      console.log("Projects info drawn successfully");
      return result;
    } catch (err) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing projects info");
    }
  }

  public static async getTaskByProjectResource(req: TaskRequest): Promise<TaskResponse[]> {
    try {
      const result = await pgDatabase.query(
        getTaskByProjectResource,
        false,
        Object.values(req)
      ).then(x => { return x });
      console.log("Tasks info drawn successfully");
      return result;
    } catch (err) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing tasks info");
    }
  }

  public static async getHoursByTaskProjectResource(req: HoursRequest): Promise<HoursResponse> {
    try {
      const result = await pgDatabase.query(
        getHoursByTaskProjectResource,
        false,
        Object.values(req)
      ).then(x => { return x[0] });
      console.log("Hours info drawn successfully");
      return result;
    } catch (err) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing hours info");
    }
  }

  public static async getTotalClockedHoursByTask(req: HoursRequest): Promise<TotalClockedHoursByTaskResponse> {
    try {
      const result = await pgDatabase.query(
        getTotalClockedHoursByTask,
        false,
        Object.values(req)
      ).then(x => { return x[0] });
      console.log("Clocked hours drawn successfully");
      console.log(result);
      return result;
    } catch (err) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing hours info");
    }
  }
}
