'use server';

import { addTopic } from '@/db/queries/topics';
import { TopicInput, topicSchema } from '@/lib/validations/topic';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createTopicAction = async (data: TopicInput) => {
    const result = topicSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const newTopic = await addTopic(result.data);

    revalidatePath('/topics');

    redirect(`/topics/${newTopic.id}`);
};