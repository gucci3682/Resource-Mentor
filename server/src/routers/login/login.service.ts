import { StatusCodes, UNAUTHORIZED } from "http-status-codes";
import { pgDatabase } from "../../Database";
import { authenticateLogin } from "../../Database/queries/login";
import { ApiError } from "../../common";
import { LoginRequest } from "./login.validator";

export type LoginResponse = {
  resource_id: string;
  resource_name: string;
}

export class LoginService {
  public static land() {
    return "My Login";
  }

  public static test() {
    return "Testing LoginService"
  }

  public static async login(req: LoginRequest): Promise<LoginResponse> {
    try {
      const result = await pgDatabase.query(
        authenticateLogin,
        false,
        Object.values(req)
      ).then(x => { return x[0] });
      if (result) {
        console.log("Login authentication successful");
        return result;
      } else {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
      }
    } catch(err) {
      if (err instanceof ApiError && err.statusCode === StatusCodes.UNAUTHORIZED) {
        throw err; // rethrow the specific UNAUTHORIZED error
      } else {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Unexpected error occurred");
      }
    }
  }
}
