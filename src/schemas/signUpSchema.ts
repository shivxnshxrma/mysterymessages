import { z } from "zod";
import { email } from "zod/v4";

export const usernameValidation = z
  .string()
  .min(3, "Username must be atleast 3 characters")
  .max(20, "Username must be atmost 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")
  .transform((val) => val.toLowerCase().trim());

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
