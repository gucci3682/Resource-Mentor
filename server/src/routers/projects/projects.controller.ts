import { Request, Response, Router } from "express";
import { ProjectsService } from "./projects.service";
import { ProjectsValidator } from "./projects.validator";

export class ProjectsController {
  public router = Router();

  constructor() {
    this.router.get("/", this.land)
    this.router.post("/getProjects", this.getProjects);
    this.router.post("/getTasks", this.getTasks);
  }
  
  private async land(req: Request, res: Response) {
    try {
      const testmsg = await ProjectsService.land();
      res.send(testmsg);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  private async getProjects(req: Request, res: Response) {
    return res.json(await ProjectsService.getProjectsByResource(ProjectsValidator.validateGetProjectsRequest(req.body)));
  }

  private async getTasks(req: Request, res: Response) {
    return res.json(await ProjectsService.getTasksByProjectResource(ProjectsValidator.validateGetTasksRequest(req.body)));
  }
}