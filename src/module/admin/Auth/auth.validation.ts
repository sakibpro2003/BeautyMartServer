import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is reqired" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});
const passwordChangeValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is reqired" }),
    newPassword: z.string({ required_error: "New Password is required" }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  passwordChangeValidationSchema,
};
