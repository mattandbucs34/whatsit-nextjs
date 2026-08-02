import { db } from '../index';
import { votes } from '../schema';
import { eq, and } from 'drizzle-orm';

export interface VoteStats {
    score: number;
    userVote: number;
}

/**
 * Casts, switches, or toggles a vote for a post.
 * - If no vote exists: creates a new vote (+1 or -1).
 * - If vote exists with the SAME value: deletes the vote (toggles back to neutral 0).
 * - If vote exists with OPPOSITE value: updates the vote value (-1 to +1 or +1 to -1).
 */
export const castVote = async (postId: number, userId: number, targetValue: 1 | -1) => {
    const existingVote = await db.query.votes.findFirst({
        where: and(
            eq(votes.postId, postId),
            eq(votes.userId, userId)
        ),
    });

    const now = new Date().toISOString();

    if (!existingVote) {
        const result = await db
            .insert(votes)
            .values({
                value: targetValue,
                postId,
                userId,
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        return { action: 'created', vote: result[0] };
    }

    if (existingVote.value === targetValue) {
        await db
            .delete(votes)
            .where(eq(votes.id, existingVote.id));

        return { action: 'deleted', voteId: existingVote.id };
    }

    const result = await db
        .update(votes)
        .set({
            value: targetValue,
            updatedAt: now,
        })
        .where(eq(votes.id, existingVote.id))
        .returning();

    return { action: 'updated', vote: result[0] };
};

/**
 * Calculates the total score and current user's vote value for a given post.
 */
export const getPostVoteStats = async (postId: number, userId?: number): Promise<VoteStats> => {
    const postVotes = await db.query.votes.findMany({
        where: eq(votes.postId, postId),
    });

    const score = postVotes.reduce((sum, v) => sum + v.value, 0);
    const userVote = userId
        ? postVotes.find((v) => v.userId === userId)?.value || 0
        : 0;

    return {
        score,
        userVote,
    };
};

/**
 * Retrieves all vote records for a specific post.
 */
export const getVotesByPostId = async (postId: number) => {
    return await db.query.votes.findMany({
        where: eq(votes.postId, postId),
    });
};
