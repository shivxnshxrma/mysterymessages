import { z } from "zod";

export const CreateEventSchema = z.object({
  name: z
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(50, "Event name must be no more than 50 characters"),
});
