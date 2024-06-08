import { RequestValidator } from "../../validator";

export type LoginRequest = {
  email: string;
  password: string;
}

export class LoginValidator {
  public static validateLoginRequest(req: unknown): LoginRequest {
    const reqObj = RequestValidator.asRecord(req);

    // Ensure `email` parameter is correct
    const email = RequestValidator.asString(reqObj.email, "'email' is invalid");
    
    // Ensure `password` parameter is correct
    const password = RequestValidator.asString(reqObj.password, "'password' is invalid");

    return { email, password };
  }
}