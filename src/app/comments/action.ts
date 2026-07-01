'use server';

import { getCommentsByPostId, createComment, deleteComment, getComment, getCommentCount } from '@/db/queries/comments';
import { commentSchema } from '@/lib/validations/comment';
import { auth } from '@/auth';

const getSessionOrThrow = async () => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error('Unauthorized: You must be signed in to perform this action');
    }
    return session;
};

export const fetchCommentsAction = async (postId: number, limit: number, offset: number) => {
    const commentsList = await getCommentsByPostId(postId, limit, offset);
    const totalCount = await getCommentCount(postId);
    return {
        comments: commentsList.map((c) => ({
            id: c.id,
            body: c.body,
            postId: c.postId,
            userId: c.userId,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            user: c.user ? { email: c.user.email } : null,
        })),
        totalCount,
        hasMore: offset + commentsList.length < totalCount,
    };
};

export const createCommentAction = async (postId: number, body: string) => {
    const session = await getSessionOrThrow();
    const result = commentSchema.safeParse({ body });

    if (!result.success) {
        throw new Error(result.error.issues[0]?.message || 'Invalid comment input');
    }

    const newComment = await createComment({
        body: result.data.body,
        postId,
        userId: parseInt(session.user.id, 10),
    });

    return {
        id: newComment.id,
        body: newComment.body,
        postId: newComment.postId,
        userId: newComment.userId,
        createdAt: newComment.createdAt,
        updatedAt: newComment.updatedAt,
        user: {
            email: session.user.email || '',
        },
    };
};

export const deleteCommentAction = async (commentId: number) => {
    const session = await getSessionOrThrow();
    const comment = await getComment(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    const isOwner = comment.userId === parseInt(session.user.id, 10);
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You do not have permission to delete this comment');
    }

    const deleted = await deleteComment(commentId);
    return {
        id: deleted.id,
    };
};
