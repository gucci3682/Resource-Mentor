import { StatusCodes } from "http-status-codes";
import { pgDatabase } from "../../Database";
import { ApiError } from "../../common";
import { PiechartRequest } from "./dashboard.validator";
import { getPieChart } from "../../Database/queries/dashboard";

export type PiechartResponse = {
  allocated: string;
  approved: string;
  pending: string;
}

export class DashboardService {
  public static land() {
    return "My Dashboard";
  }

  public static async getPieChart(req: PiechartRequest): Promise<PiechartResponse> {
    try {
      const result = await pgDatabase.query(
        getPieChart,
        false,
        Object.values(req)
      ).then(x => { return x[0] });
      console.log("Piechart data drawn successfully: ", result);
      return result;
    } catch(err) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error drawing piechart data");
    }
  }
}
