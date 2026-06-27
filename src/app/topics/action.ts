'use server';

import { addTopic, deleteTopic, updateTopic } from '@/db/queries/topics';
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

export const updateTopicAction = async (id: number, data: TopicInput) => {
    const result = topicSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const updatedTopic = await updateTopic(id, result.data);

    revalidatePath('/topics');
    revalidatePath(`/topics/${id}`);

    redirect(`/topics/${updatedTopic.id}`);
};

export const deleteTopicAction = async (id: number) => {
    await deleteTopic(id);

    revalidatePath('/topics');

    redirect('/topics');
};