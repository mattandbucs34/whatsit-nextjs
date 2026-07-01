import { db } from '../index';
import { users, posts, comments, favorites } from '../schema';
import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const createUser = async (data: { email: string; passwordPlain: string }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.passwordPlain, salt);
    const now = new Date().toISOString();

    const result = await db
        .insert(users)
        .values({
            email: data.email,
            password: hashedPassword,
            role: 'member',
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

export const createOAuthUser = async (email: string) => {
    const placeholderPlain = Math.random().toString(36) + Math.random().toString(36);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(placeholderPlain, salt);
    const now = new Date().toISOString();

    const result = await db
        .insert(users)
        .values({
            email,
            password: hashedPassword,
            role: 'member',
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

export const getUserByEmail = async (email: string) => {
    return await db.query.users.findFirst({
        where: eq(users.email, email),
    });
};

export const getUserProfile = async (id: number) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!user) {
        return null;
    }

    // Fetch the last 5 posts
    const lastPosts = await db.query.posts.findMany({
        where: eq(posts.userId, id),
        limit: 5,
        orderBy: [desc(posts.createdAt)],
    });

    // Fetch the last 5 comments with their associated post
    const lastComments = await db.query.comments.findMany({
        where: eq(comments.userId, id),
        limit: 5,
        orderBy: [desc(comments.createdAt)],
        with: {
            post: true,
        },
    });

    // Fetch the last 5 favorites with their associated post
    const lastFavorites = await db.query.favorites.findMany({
        where: eq(favorites.userId, id),
        limit: 5,
        orderBy: [desc(favorites.createdAt)],
        with: {
            post: true,
        },
    });

    return {
        user,
        posts: lastPosts,
        comments: lastComments,
        favorites: lastFavorites,
    };
};
