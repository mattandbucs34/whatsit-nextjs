import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    createFlairAction,
    updateFlairAction,
    deleteFlairAction,
    fetchFlairsAction,
} from '../action';
import { db } from '@/db';
import { flairs, topics, posts, votes } from '@/db/schema';
import * as authModule from '@/auth';

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

describe('Flair Server Actions', () => {
    let testFlairId: number;

    beforeEach(async () => {
        vi.clearAllMocks();

        await db.delete(votes);
        await db.delete(posts);
        await db.delete(topics);
        await db.delete(flairs);

        const now = new Date().toISOString();
        const created = await db
            .insert(flairs)
            .values({
                name: 'Existing Flair',
                color: '#58A6FF',
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        testFlairId = created[0].id;
    });

    describe('createFlairAction()', () => {
        it('should throw unauthorized error if user is not signed in', async () => {
            vi.mocked(authModule.auth).mockResolvedValue(null as never);

            await expect(
                createFlairAction({ name: 'New Flair', color: '#123456' })
            ).rejects.toThrow('Unauthorized: You must be signed in');
        });

        it('should throw unauthorized error if user is not an admin', async () => {
            vi.mocked(authModule.auth).mockResolvedValue({
                user: { id: '1', role: 'member' },
            } as never);

            await expect(
                createFlairAction({ name: 'New Flair', color: '#123456' })
            ).rejects.toThrow('Unauthorized: Only administrators can manage flairs');
        });

        it('should create flair when invoked by an admin', async () => {
            vi.mocked(authModule.auth).mockResolvedValue({
                user: { id: '1', role: 'admin' },
            } as never);

            const result = await createFlairAction({
                name: 'Admin Created Flair',
                color: '#f85149',
            });

            expect(result).toBeDefined();
            expect(result.name).toBe('Admin Created Flair');
            expect(result.color).toBe('#f85149');
        });
    });

    describe('updateFlairAction()', () => {
        it('should allow admin to update a flair', async () => {
            vi.mocked(authModule.auth).mockResolvedValue({
                user: { id: '1', role: 'admin' },
            } as never);

            const updated = await updateFlairAction(testFlairId, {
                name: 'Renamed Flair',
                color: '#2ea44f',
            });

            expect(updated.name).toBe('Renamed Flair');
            expect(updated.color).toBe('#2ea44f');
        });
    });

    describe('deleteFlairAction()', () => {
        it('should allow admin to delete a flair', async () => {
            vi.mocked(authModule.auth).mockResolvedValue({
                user: { id: '1', role: 'admin' },
            } as never);

            const deleted = await deleteFlairAction(testFlairId);
            expect(deleted.id).toBe(testFlairId);
        });
    });

    describe('fetchFlairsAction()', () => {
        it('should fetch all flairs for public users', async () => {
            vi.mocked(authModule.auth).mockResolvedValue(null as never);

            const list = await fetchFlairsAction();
            expect(list).toHaveLength(1);
            expect(list[0].name).toBe('Existing Flair');
        });
    });
});
