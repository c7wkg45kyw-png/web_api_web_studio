import { z } from "zod";

export const customerUpdateSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name:  z.string().min(1).optional(),
  phone:      z.string().optional(),
  address:    z.string().optional()
}).refine(v => Object.keys(v).length > 0, { message: "No fields to update" });
