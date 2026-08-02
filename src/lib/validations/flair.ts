import { z } from 'zod';

export const flairSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be 2 or more characters long' }),
    color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'Color must be a valid hex code (e.g. #58A6FF)' })
        .optional(),
});

export type FlairInput = z.infer<typeof flairSchema>;
