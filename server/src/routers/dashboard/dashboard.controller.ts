import { Request, Response, Router } from "express";
import { DashboardService } from "./dashboard.service";
import { DashboardValidator } from "./dashboard.validator";

export class DashboardController {
  public router = Router();

  constructor() {
    this.router.get("/", this.land);
    this.router.post("/piechart", this.getPieChart);
  }
  
  private async land(req: Request, res: Response) {
    try {
      const testmsg = await DashboardService.land();
      res.send(testmsg);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  private async getPieChart(req: Request, res: Response) {
    return res.json(await DashboardService.getPieChart(DashboardValidator.validatePieChartRequest(req.body)));
  }
}