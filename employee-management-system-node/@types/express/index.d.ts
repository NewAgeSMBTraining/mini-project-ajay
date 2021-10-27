import { ManagerDocument } from "../../src/models/manager";
import { UserDocument } from "../../src/models/user";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
      token: string;
      manager: ManagerDocument;
    }
  }
}
