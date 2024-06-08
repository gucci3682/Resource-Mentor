import { StatusCodes } from "http-status-codes";
import { pgDatabase } from "../../Database";
import { getHistory, getHistoryMonth } from "../../Database/queries/history";
import { ApiError } from "../../common";
import { TimesheetResponse } from "../timesheet";
import { HistoryRequest } from "./history.validator";

export type HistoryResponse = TimesheetResponse[];
export class HistoryService {
  public static land() {
    return "My History";
  }

  public static async getHistory(req: HistoryRequest): Promise<HistoryResponse> {
    if (req.month) {
      try {
        const result = await pgDatabase.query(
          getHistoryMonth,
          false,
          Object.values(req)
        ).then(x => { return x });
        console.log("History successfully drawn at: ", new Date());
        return result;
      } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Unexpected error occurred");
      }
    } else {
      try {
        const { month, ...rest } = req;
        const result = await pgDatabase.query(
          getHistory,
          false,
          Object.values(rest)
        ).then(x => { return x });
        console.log("History successfully drawn at: ", new Date());
        return result;
      } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Unexpected error occurred");
      }
    }
  }
}
