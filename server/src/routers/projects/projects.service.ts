import { StatusCodes } from "http-status-codes";
import { pgDatabase } from "../../Database";
import { ApiError } from "../../common";
import { GetProjectsRequest, GetTasksRequest } from "./projects.validator";
import { getProjectsByResource, getProjectsByResourceMonth, getTasksByProjectResource, getTasksByProjectResourceMonth } from "../../Database/queries/projects";

export type GetProjectsResponse = {
  project_id: string;
  project_so: string;
  project_name: string;
  allocated: number;
  approved: number;
  pending: number;
}

export type GetTasksResponse = {
  task_id: string;
  task_name: string;
  allocated: number;
  approved: number;
  pending: number;
}

export class ProjectsService {
  public static land() {
    return "My Activity";
  }

  public static async getProjectsByResource(req: GetProjectsRequest): Promise<GetProjectsResponse[]> {
    if (req.month) {
      try {
        const result = await pgDatabase.query(
          getProjectsByResourceMonth,
          false,
          Object.values(req)
        ).then(x => { return x });
        console.log("Projects drawn successfully: ", result);
        return result;
      } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing projects");
      }
    } else {
      try {
        const { month, ...rest } = req;
        const result = await pgDatabase.query(
          getProjectsByResource,
          false,
          Object.values(rest)
        ).then(x => { return x });
        console.log("Projects drawn successfully: ", result);
        return result;
      } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing projects");
      }
    }
  }

  public static async getTasksByProjectResource(req: GetTasksRequest): Promise<GetTasksResponse[]> {
    if (req.month) {
      try {
        const result = await pgDatabase.query(
          getTasksByProjectResourceMonth,
          false,
          Object.values(req)
        ).then(x => { return x });
        console.log("Tasks drawn successfully: ", result);
        return result;
      } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing tasks");
      }
    } else {
      const { month, ...rest } = req;
      try {
        const result = await pgDatabase.query(
          getTasksByProjectResource,
          false,
          Object.values(rest)
        ).then(x => { return x });
        console.log("Tasks drawn successfully: ", result);
        return result;
      } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing tasks");
      }
    }
  }
}
