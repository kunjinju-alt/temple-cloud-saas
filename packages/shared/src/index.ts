import { z } from "zod";

export const templeIdSchema = z.string().min(1);

export const devoteeSchema = z.object({
  id: z.string(),
  templeId: templeIdSchema,
  name: z.string().min(1),
  dharmaName: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  memo: z.string().optional()
});

export type Devotee = z.infer<typeof devoteeSchema>;