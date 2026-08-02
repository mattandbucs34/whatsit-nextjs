'use server';

import { castVote, getPostVoteStats, VoteStats } from '@/db/queries/votes';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const getSessionOrThrow = async () => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error('Unauthorized: You must be signed in to vote');
    }
    return session;
};

/**
 * Server action to cast, switch, or toggle a vote on a post.
 */
export const voteAction = async (
    postId: number,
    targetValue: 1 | -1,
    topicId?: number
): Promise<VoteStats> => {
    const session = await getSessionOrThrow();
    const userId = parseInt(session.user.id, 10);

    await castVote(postId, userId, targetValue);

    if (topicId) {
        revalidatePath(`/topics/${topicId}`);
        revalidatePath(`/topics/${topicId}/posts/${postId}`);
    }

    return await getPostVoteStats(postId, userId);
};

/**
 * Server action to fetch current vote stats for a post.
 */
export const fetchVoteStatsAction = async (postId: number): Promise<VoteStats> => {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : undefined;

    return await getPostVoteStats(postId, userId);
};
