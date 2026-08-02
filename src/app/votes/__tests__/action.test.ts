import { beforeEach, describe, expect, it, vi } from 'vitest';
import { voteAction, fetchVoteStatsAction } from '../action';
import { db } from '@/db';
import { votes, posts, topics, users } from '@/db/schema';
import * as authModule from '@/auth';

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}));

describe('Vote Server Actions', () => {
    let testUserId: number;
    let testPostId: number;

    beforeEach(async () => {
        vi.clearAllMocks();

        await db.delete(votes);
        await db.delete(posts);
        await db.delete(topics);
        await db.delete(users);

        const now = new Date().toISOString();

        const userRes = await db
            .insert(users)
            .values({
                email: 'actionuser@example.com',
                password: 'password123',
                role: 'member',
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        testUserId = userRes[0].id;

        const topicRes = await db
            .insert(topics)
            .values({
                title: 'Action Test Topic',
                description: 'Testing actions',
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        const postRes = await db
            .insert(posts)
            .values({
                title: 'Action Test Post',
                body: 'Testing server action',
                topicId: topicRes[0].id,
                userId: testUserId,
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        testPostId = postRes[0].id;
    });

    describe('voteAction()', () => {
        it('should throw unauthorized error if user is not signed in', async () => {
            vi.mocked(authModule.auth).mockResolvedValue(null as never);

            await expect(voteAction(testPostId, 1)).rejects.toThrow(
                'Unauthorized: You must be signed in to vote'
            );
        });

        it('should cast vote and return updated vote stats for signed in user', async () => {
            vi.mocked(authModule.auth).mockResolvedValue({
                user: { id: String(testUserId), email: 'actionuser@example.com' },
            } as never);

            const result = await voteAction(testPostId, 1);

            expect(result.score).toBe(1);
            expect(result.userVote).toBe(1);
        });
    });

    describe('fetchVoteStatsAction()', () => {
        it('should fetch vote stats for unauthenticated user', async () => {
            vi.mocked(authModule.auth).mockResolvedValue(null as never);

            const result = await fetchVoteStatsAction(testPostId);

            expect(result.score).toBe(0);
            expect(result.userVote).toBe(0);
        });
    });
});
