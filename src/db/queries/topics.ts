import { db } from '../index';
import { topics } from '../schema';
import { eq } from 'drizzle-orm';


export const getAllTopics = async () => {
    return await db.query.topics.findMany({
        with: {
            flair: true,
        },
    });
};

export const getTopic = async (id: number) => {
    return await db.query.topics.findFirst({
        where: eq(topics.id, id),
        with: {
            flair: true,
            posts: {
                with: {
                    votes: true,
                    comments: {
                        columns: {
                            id: true,
                        },
                    },
                },
            },
        },
    });
};

export const addTopic = async (data: {
    title: string;
    description: string;
    flairId?: number | null;
}) => {
    const now = new Date().toISOString();
    const result = await db
        .insert(topics)
        .values({
            title: data.title,
            description: data.description,
            flairId: data.flairId || null,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

export const updateTopic = async (
    id: number,
    data: { title: string; description: string; flairId?: number | null }
) => {
    const result = await db
        .update(topics)
        .set({
            title: data.title,
            description: data.description,
            flairId: data.flairId !== undefined ? data.flairId : null,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(topics.id, id))
        .returning();

    return result[0];
};

export const deleteTopic = async (id: number) => {
    const result = await db
        .delete(topics)
        .where(eq(topics.id, id))
        .returning();

    return result[0];
};