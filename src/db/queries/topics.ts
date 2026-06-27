import { db } from '../index';
import { topics } from '../schema';
import { eq } from 'drizzle-orm';


export const getAllTopics = async () => {
    return await db.select().from(topics);
};

export const getTopic = async (id: number) => {
    return await db.query.topics.findFirst({
        where: eq(topics.id, id),
        with: {
            posts: true,
        }
    });
};

export const addTopic = async (data: {
    title: string,
    description: string,
}) => {
    const now = new Date().toISOString();
    const result = await db
        .insert(topics)
        .values({
            title: data.title,
            description: data.description,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

export const updateTopic = async (id: number, data: { title: string, description: string }) => {
    const result = await db
        .update(topics)
        .set({
            title: data.title,
            description: data.description,
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