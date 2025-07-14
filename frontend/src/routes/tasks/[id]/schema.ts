import * as z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["New", "In Progress", "Completed"]).default("New"),
});
