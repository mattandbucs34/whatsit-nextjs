'use server';

import {
    getAllFlairs,
    getFlair,
    createFlair,
    updateFlair,
    deleteFlair,
} from '@/db/queries/flairs';
import { flairSchema, FlairInput } from '@/lib/validations/flair';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const getAdminSessionOrThrow = async () => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error('Unauthorized: You must be signed in');
    }
    if (session.user.role !== 'admin') {
        throw new Error('Unauthorized: Only administrators can manage flairs');
    }
    return session;
};

/**
 * Server Action to fetch all flairs.
 */
export const fetchFlairsAction = async () => {
    return await getAllFlairs();
};

/**
 * Server Action to create a new flair (Admin only).
 */
export const createFlairAction = async (data: FlairInput) => {
    await getAdminSessionOrThrow();
    const result = flairSchema.safeParse(data);

    if (!result.success) {
        throw new Error(result.error.issues[0]?.message || 'Invalid flair input');
    }

    const newFlair = await createFlair(result.data);
    revalidatePath('/topics');
    return newFlair;
};

/**
 * Server Action to update an existing flair (Admin only).
 */
export const updateFlairAction = async (id: number, data: FlairInput) => {
    await getAdminSessionOrThrow();

    const existing = await getFlair(id);
    if (!existing) {
        throw new Error('Flair not found');
    }

    const result = flairSchema.safeParse(data);
    if (!result.success) {
        throw new Error(result.error.issues[0]?.message || 'Invalid flair input');
    }

    const updated = await updateFlair(id, result.data);
    revalidatePath('/topics');
    return updated;
};

/**
 * Server Action to delete a flair (Admin only).
 */
export const deleteFlairAction = async (id: number) => {
    await getAdminSessionOrThrow();

    const existing = await getFlair(id);
    if (!existing) {
        throw new Error('Flair not found');
    }

    const deleted = await deleteFlair(id);
    revalidatePath('/topics');
    return deleted;
};
