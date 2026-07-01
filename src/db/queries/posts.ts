import { db } from '../index';
import { posts, users } from '../schema';
import { eq } from 'drizzle-orm';

// Helper to ensure a guest user exists in the database for bypass auth
export const getOrCreateGuestUser = async () => {
    const guestUser = await db.query.users.findFirst({
        where: eq(users.email, 'guest@whatsit.com'),
    });

    if (guestUser) {
        return guestUser;
    }

    const now = new Date().toISOString();
    const result = await db
        .insert(users)
        .values({
            email: 'guest@whatsit.com',
            password: 'guest-password-placeholder',
            role: 'member', // standard guest member
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

export const createPost = async (data: {
    title: string;
    body: string;
    topicId: number;
    userId: number;
}) => {
    const now = new Date().toISOString();

    const result = await db
        .insert(posts)
        .values({
            title: data.title,
            body: data.body,
            topicId: data.topicId,
            userId: data.userId,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

export const getPost = async (id: number) => {
    return await db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
            user: true, // author of the post
            comments: {
                with: {
                    user: true, // author of the comment
                },
            },
            votes: true,
            favorites: true,
        },
    });
};

export const updatePost = async (id: number, data: { title: string; body: string }) => {
    const result = await db
        .update(posts)
        .set({
            title: data.title,
            body: data.body,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(posts.id, id))
        .returning();

    return result[0];
};

export const deletePost = async (id: number) => {
    const result = await db
        .delete(posts)
        .where(eq(posts.id, id))
        .returning();

    return result[0];
};

export const getPostsByTopicId = async (topicId: number, limit: number = 20, offset: number = 0) => {
    return await db.query.posts.findMany({
        where: eq(posts.topicId, topicId),
        limit,
        offset,
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        with: {
            user: true,
            votes: true,
            favorites: true,
        },
    });
};

