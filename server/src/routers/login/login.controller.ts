import { Request, Response, Router } from "express";
import { LoginService } from "./login.service";
import { LoginValidator } from "./login.validator";

export class LoginController {
  public router = Router();

  constructor() {
    this.router.post("/auth", this.login);
  }

  private async login(req: Request, res: Response) {
    const result = await LoginService.login(LoginValidator.validateLoginRequest(req.body)).then(x => { return x });
    return res.json(result);
  }
}