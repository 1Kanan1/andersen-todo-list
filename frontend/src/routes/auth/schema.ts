import { z } from "zod/v4";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
});

export const passwordRules = [
  {
    message: "At least 8 characters",
    isValid: (value: string) => value.length >= 8,
  },
  {
    message: "At least one uppercase letter",
    isValid: (value: string) => /[A-Z]/.test(value),
  },
  {
    message: "At least one lowercase letter",
    isValid: (value: string) => /[a-z]/.test(value),
  },
  {
    message: "At least one digit",
    isValid: (value: string) => /[0-9]/.test(value),
  },
];
