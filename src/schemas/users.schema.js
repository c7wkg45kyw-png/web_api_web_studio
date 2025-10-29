import { z } from "zod";

export const createEmployeeSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const updateRoleSchema = z.object({
  role: z.enum(["employee", "customer"])
});
