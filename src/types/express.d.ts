import { TUser } from "../User/user.interface";

declare module "express" {
  export interface Request {
    user?: TUser;
  }
}
