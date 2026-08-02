import { db } from '../index';
import { flairs } from '../schema';
import { eq } from 'drizzle-orm';

export interface FlairInput {
    name: string;
    color?: string;
}

/**
 * Retrieves all flairs from the database.
 */
export const getAllFlairs = async () => {
    return await db.query.flairs.findMany({
        orderBy: (flairs, { asc }) => [asc(flairs.name)],
    });
};

/**
 * Retrieves a single flair by ID.
 */
export const getFlair = async (id: number) => {
    return await db.query.flairs.findFirst({
        where: eq(flairs.id, id),
    });
};

/**
 * Creates a new flair record.
 */
export const createFlair = async (data: FlairInput) => {
    const now = new Date().toISOString();

    const result = await db
        .insert(flairs)
        .values({
            name: data.name,
            color: data.color || '#58A6FF', // Default theme blue accent
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return result[0];
};

/**
 * Updates an existing flair record by ID.
 */
export const updateFlair = async (id: number, data: Partial<FlairInput>) => {
    const now = new Date().toISOString();

    const result = await db
        .update(flairs)
        .set({
            ...(data.name !== undefined && { name: data.name }),
            ...(data.color !== undefined && { color: data.color }),
            updatedAt: now,
        })
        .where(eq(flairs.id, id))
        .returning();

    return result[0];
};

/**
 * Deletes a flair record by ID.
 */
export const deleteFlair = async (id: number) => {
    const result = await db
        .delete(flairs)
        .where(eq(flairs.id, id))
        .returning();

    return result[0];
};
