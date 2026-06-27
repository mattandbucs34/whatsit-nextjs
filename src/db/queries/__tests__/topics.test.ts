import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../index';
import { topics } from '../../schema';
import { addTopic, getTopic, getAllTopics } from '../topics';

describe('Topics Database Queries', () => {
    // Before each test, clear the topics table to ensure test isolation
    beforeEach(async () => {
        await db.delete(topics);
    });

    describe('addTopic()', () => {
        it('should insert a new topic and return it', async () => {
            const newTopic = await addTopic({
                title: 'Next.js Guide',
                description: 'Learn App Router step-by-step',
            });

            expect(newTopic).toBeDefined();
            expect(newTopic.id).toBeTypeOf('number');
            expect(newTopic.title).toBe('Next.js Guide');
            expect(newTopic.description).toBe('Learn App Router step-by-step');
        });
    });

    describe('getTopic()', () => {
        it('should fetch a single topic by ID', async () => {
            // Seed a topic first
            const created = await addTopic({
                title: 'React 19',
                description: 'What is new in React 19',
            });

            // Retrieve it
            const fetched = await getTopic(created.id);

            expect(fetched).toBeDefined();
            expect(fetched?.title).toBe('React 19');
        });
    });

    describe('getAllTopics()', () => {
        it('should fetch all topics', async () => {
            // Seed two topics specifically for this test
            await addTopic({ title: 'Topic 1', description: 'Desc 1' });
            await addTopic({ title: 'Topic 2', description: 'Desc 2' });

            const fetched = await getAllTopics();
            expect(fetched).toBeDefined();
            expect(Array.isArray(fetched)).toBe(true);
            expect(fetched.length).toBe(2);
        });
    });
});
