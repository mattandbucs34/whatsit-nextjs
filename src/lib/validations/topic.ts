import { z } from 'zod';

export const topicSchema = z.object({
    title: z
        .string()
        .min(5, { message: 'Title must be 5 or more characters long' }),
    description: z
        .string()
        .min(10, { message: 'Description must be 10 or more characters long' }),
});

export type TopicInput = z.infer<typeof topicSchema>;
