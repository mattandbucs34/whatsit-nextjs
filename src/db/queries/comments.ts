import { db } from '../index';
import { comments } from '../schema';
import { eq, count } from 'drizzle-orm';

export const getCommentsByPostId = async (postId: number, limit: number = 10, offset: number = 0) => {
    return await db.query.comments.findMany({
        where: eq(comments.postId, postId),
        limit,
        offset,
        orderBy: (comments, { asc }) => [asc(comments.createdAt)],
        with: {
            user: true,
        },
    });
};

export const getComment = async (id: number) => {
    return await db.query.comments.findFirst({
        where: eq(comments.id, id),
    });
};

export const getCommentCount = async (postId: number) => {
    const result = await db
        .select({ value: count() })
        .from(comments)
        .where(eq(comments.postId, postId));
    return result[0]?.value || 0;
};

export const createComment = async (data: {
    body: string;
    postId: number;
    userId: number;
}) => {
    const now = new Date().toISOString();

    const result = await db
        .insert(comments)
        .values({
            body: data.body,
            postId: data.postId,
            userId: data.userId,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

export const updateComment = async (id: number, data: { body: string }) => {
    const result = await db
        .update(comments)
        .set({
            body: data.body,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(comments.id, id))
        .returning();

    return result[0];
};

export const deleteComment = async (id: number) => {
    const result = await db
        .delete(comments)
        .where(eq(comments.id, id))
        .returning();

    return result[0];
};