import { z } from "zod";

export const accepMessageSchema = z.object({
  accepMessages: z.boolean(),
});
