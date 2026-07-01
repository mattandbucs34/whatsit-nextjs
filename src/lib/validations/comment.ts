import { z } from 'zod';

export const commentSchema = z.object({
    body: z
        .string()
        .min(5, { message: 'Comment must be at least 5 characters long' }),
});

export type CommentInput = z.infer<typeof commentSchema>;