import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../index';
import { votes, posts, topics, users } from '../../schema';
import { castVote, getPostVoteStats } from '../votes';

describe('Votes Database Queries', () => {
    let testUserId: number;
    let testPostId: number;

    beforeEach(async () => {
        // Clean up database tables
        await db.delete(votes);
        await db.delete(posts);
        await db.delete(topics);
        await db.delete(users);

        const now = new Date().toISOString();

        // Seed test user
        const userRes = await db
            .insert(users)
            .values({
                email: 'testvoteuser@example.com',
                password: 'password123',
                role: 'member',
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        testUserId = userRes[0].id;

        // Seed test topic
        const topicRes = await db
            .insert(topics)
            .values({
                title: 'Voting Test Topic',
                description: 'Testing modern voting queries',
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        // Seed test post
        const postRes = await db
            .insert(posts)
            .values({
                title: 'Voting Test Post',
                body: 'Testing castVote functionality',
                topicId: topicRes[0].id,
                userId: testUserId,
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        testPostId = postRes[0].id;
    });

    describe('castVote()', () => {
        it('should insert a new upvote when no vote exists', async () => {
            const res = await castVote(testPostId, testUserId, 1);
            expect(res.action).toBe('created');

            const stats = await getPostVoteStats(testPostId, testUserId);
            expect(stats.score).toBe(1);
            expect(stats.userVote).toBe(1);
        });

        it('should toggle off (delete) an existing upvote when upvoted again', async () => {
            // First upvote
            await castVote(testPostId, testUserId, 1);

            // Second upvote -> toggle off
            const res = await castVote(testPostId, testUserId, 1);
            expect(res.action).toBe('deleted');

            const stats = await getPostVoteStats(testPostId, testUserId);
            expect(stats.score).toBe(0);
            expect(stats.userVote).toBe(0);
        });

        it('should switch an existing downvote to an upvote', async () => {
            // Downvote first
            await castVote(testPostId, testUserId, -1);

            let stats = await getPostVoteStats(testPostId, testUserId);
            expect(stats.score).toBe(-1);
            expect(stats.userVote).toBe(-1);

            // Switch to upvote
            const res = await castVote(testPostId, testUserId, 1);
            expect(res.action).toBe('updated');

            stats = await getPostVoteStats(testPostId, testUserId);
            expect(stats.score).toBe(1);
            expect(stats.userVote).toBe(1);
        });
    });

    describe('getPostVoteStats()', () => {
        it('should aggregate total score across multiple users', async () => {
            const now = new Date().toISOString();

            // Create second user
            const user2Res = await db
                .insert(users)
                .values({
                    email: 'user2@example.com',
                    password: 'password123',
                    role: 'member',
                    createdAt: now,
                    updatedAt: now,
                })
                .returning();
            const user2Id = user2Res[0].id;

            // User 1 upvotes (+1)
            await castVote(testPostId, testUserId, 1);
            // User 2 downvotes (-1)
            await castVote(testPostId, user2Id, -1);

            const statsForUser1 = await getPostVoteStats(testPostId, testUserId);
            expect(statsForUser1.score).toBe(0); // 1 + (-1) = 0
            expect(statsForUser1.userVote).toBe(1);

            const statsForUser2 = await getPostVoteStats(testPostId, user2Id);
            expect(statsForUser2.score).toBe(0);
            expect(statsForUser2.userVote).toBe(-1);
        });
    });
});
