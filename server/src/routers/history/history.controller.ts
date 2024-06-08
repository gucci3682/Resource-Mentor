import { Request, Response, Router } from "express";
import { HistoryService } from "./history.service";
import { HistoryValidator } from "./history.validator";

export class HistoryController {
  public router = Router();

  constructor() {
    this.router.get("/", this.land)
    this.router.post("/get", this.getHistory);
  }
  
  private async land(req: Request, res: Response) {
    try {
      const testmsg = await HistoryService.land();
      res.send(testmsg);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  private async getHistory(req: Request, res: Response) {
    const result = await HistoryService.getHistory(HistoryValidator.validateHistoryRequest(req.body));
    return res.json(result);
  }
}