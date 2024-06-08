import { Request, Response, Router } from "express";
import { TimesheetService } from "./timesheet.service";
import { TimesheetValidator } from "./timesheet.validator";

export class TimesheetController {
  public router = Router();

  constructor() {
    this.router.get("/", this.land)
    this.router.post("/create", this.createTimesheet);
    this.router.post("/create-multiple", this.createMultipleTimesheets);
    this.router.post("/getProject", this.getProjectByResource);
    this.router.post("/getTask", this.getTaskByProjectResource);
    this.router.post("/getHours", this.getHoursByTaskProjectResource);
    this.router.post("/getTotalClocked", this.getTotalClockedHoursByTask)
  }

  private async land(req: Request, res: Response) {
    try {
      const testmsg = await TimesheetService.land();
      res.send(testmsg);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  private async createTimesheet(req: Request, res: Response) {
    return res.json(await TimesheetService.createTimesheet(TimesheetValidator.validateTimesheetRequest(req.body)));
  }

  private async createMultipleTimesheets(req: Request, res: Response) {
    return res.json(await TimesheetService.createMultipleTimesheets(TimesheetValidator.validateMultipleTimesheetsRequest(req.body)));
  }

  private async getProjectByResource(req: Request, res: Response) {
    return res.json(await TimesheetService.getProjectByResource(TimesheetValidator.validateProjectRequest(req.body)));
  }

  private async getTaskByProjectResource(req: Request, res: Response) {
    return res.json(await TimesheetService.getTaskByProjectResource(TimesheetValidator.validateTaskRequest(req.body)));
  }

  private async getHoursByTaskProjectResource(req: Request, res: Response) {
    return res.json(await TimesheetService.getHoursByTaskProjectResource(TimesheetValidator.validateHoursRequest(req.body)));
  }

  private async getTotalClockedHoursByTask(req: Request, res: Response) {
    return res.json(await TimesheetService.getTotalClockedHoursByTask(TimesheetValidator.validateHoursRequest(req.body)));
  }
}