import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../index';
import { flairs, topics, posts, votes } from '../../schema';
import {
    createFlair,
    getFlair,
    getAllFlairs,
    updateFlair,
    deleteFlair,
} from '../flairs';

describe('Flairs Database Queries', () => {
    beforeEach(async () => {
        // Clean up database tables in order
        await db.delete(votes);
        await db.delete(posts);
        await db.delete(topics);
        await db.delete(flairs);
    });

    describe('createFlair()', () => {
        it('should insert a new flair and return it', async () => {
            const newFlair = await createFlair({
                name: 'Announcement',
                color: '#f85149',
            });

            expect(newFlair).toBeDefined();
            expect(newFlair.id).toBeTypeOf('number');
            expect(newFlair.name).toBe('Announcement');
            expect(newFlair.color).toBe('#f85149');
        });

        it('should use default color if not provided', async () => {
            const newFlair = await createFlair({
                name: 'General',
            });

            expect(newFlair).toBeDefined();
            expect(newFlair.color).toBe('#58A6FF');
        });
    });

    describe('getFlair()', () => {
        it('should fetch a single flair by ID', async () => {
            const created = await createFlair({
                name: 'Discussion',
                color: '#2ea44f',
            });

            const fetched = await getFlair(created.id);

            expect(fetched).toBeDefined();
            expect(fetched?.name).toBe('Discussion');
            expect(fetched?.color).toBe('#2ea44f');
        });
    });

    describe('getAllFlairs()', () => {
        it('should fetch all flairs sorted by name', async () => {
            await createFlair({ name: 'Tutorial', color: '#a371f7' });
            await createFlair({ name: 'Bug Report', color: '#d29922' });

            const allFlairs = await getAllFlairs();

            expect(allFlairs).toHaveLength(2);
            expect(allFlairs[0].name).toBe('Bug Report');
            expect(allFlairs[1].name).toBe('Tutorial');
        });
    });

    describe('updateFlair()', () => {
        it('should update an existing flair record', async () => {
            const created = await createFlair({
                name: 'Old Name',
                color: '#123456',
            });

            const updated = await updateFlair(created.id, {
                name: 'Updated Name',
                color: '#654321',
            });

            expect(updated.name).toBe('Updated Name');
            expect(updated.color).toBe('#654321');
        });
    });

    describe('deleteFlair()', () => {
        it('should delete a flair by ID', async () => {
            const created = await createFlair({
                name: 'To Delete',
            });

            const deleted = await deleteFlair(created.id);
            expect(deleted.id).toBe(created.id);

            const fetched = await getFlair(created.id);
            expect(fetched).toBeUndefined();
        });
    });
});
