import { Request, Response, Router } from "express";
import { ProfileService } from "./profile.service";

export class ProfileController {
  public router = Router();

  constructor() {
    this.router.get("/", this.land)
    this.router.get("/test", this.test)
  }
  
  private async land(req: Request, res: Response) {
    try {
      const testmsg = await ProfileService.land();
      res.send(testmsg);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  private async test(req: Request, res: Response) {
    try {
      const testmsg = await ProfileService.test();
      res.send(testmsg);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}