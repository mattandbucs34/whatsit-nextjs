import { z } from 'zod';

export const postSchema = z.object({
    title: z
        .string()
        .min(2, { message: 'Title must be at least 2 characters in length' }),
    body: z
        .string()
        .min(10, { message: 'Body must be at least 10 characters in length' }),
});

export type PostInput = z.infer<typeof postSchema>;
