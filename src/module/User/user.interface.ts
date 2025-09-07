import { Model } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export interface TUser extends JwtPayload {
  id: string;
  name: string;
  email: string;
  address?: string;
  profileImage:string,
  coverImage:string,
  password: string;
  role: "admin" | "customer";
  isBlocked: boolean;
  phone: string;
  gender: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
