'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import NextLink from 'next/link';
import { IComment } from '@/interfaces/IComment';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { fetchCommentsAction } from '@/app/comments/action';

interface CommentsSectionProps {
    postId: number;
    currentUser: {
        id: string;
        email: string;
        role: string;
    } | null;
}

export const CommentsSection = ({ postId, currentUser }: CommentsSectionProps) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);

    const observer = useRef<IntersectionObserver | null>(null);

    const loadMoreComments = useCallback(async (reset: boolean = false) => {
        setIsLoading(true);
        try {
            const currentOffset = reset ? 0 : offset;
            const result = await fetchCommentsAction(postId, 10, currentOffset);

            setComments((prev) => {
                const combined = reset ? result.comments : [...prev, ...result.comments];
                // Deduplicate by ID
                const unique = combined.filter((c, index, self) =>
                    self.findIndex((t) => t.id === c.id) === index
                );
                return unique;
            });
            setTotalCount(result.totalCount);
            setHasMore(result.hasMore);
            setOffset(currentOffset + result.comments.length);
        } catch (err) {
            console.error('Failed to load comments:', err);
        } finally {
            setIsLoading(false);
        }
    }, [postId, offset]);

    // Load initial page
    useEffect(() => {
        loadMoreComments(true);
    }, [postId]);

    // Intersection Observer callback ref for infinite scrolling
    const lastCommentElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && hasMore) {
                loadMoreComments();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, loadMoreComments]);

    const handleCommentAdded = (newComment: IComment) => {
        setComments((prev) => [...prev, newComment]); // Chronological (appended at bottom)
        setTotalCount((prev) => prev + 1);
    };

    const handleCommentDeleted = (deletedId: number) => {
        setComments((prev) => prev.filter((c) => c.id !== deletedId));
        setTotalCount((prev) => Math.max(0, prev - 1));
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant={'h6'} sx={{ mb: 2, fontWeight: 700 }}>
                Comments ({totalCount})
            </Typography>

            {/* Comments List */}
            <Stack spacing={2} sx={{ mb: 3 }}>
                {comments.map((comment, index) => {
                    const isLast = index === comments.length - 1;
                    return (
                        <div key={comment.id} ref={isLast ? lastCommentElementRef : null}>
                            <CommentItem
                                comment={comment}
                                currentUser={currentUser}
                                onDeleteSuccess={handleCommentDeleted}
                            />
                        </div>
                    );
                })}

                {/* Loading State Spinner */}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} color={'primary'} />
                    </Box>
                )}

                {/* No Comments State */}
                {!isLoading && comments.length === 0 && (
                    <Typography color={'text.secondary'} sx={{ fontStyle: 'italic', py: 1 }}>
                        No comments yet. Be the first to share your thoughts!
                    </Typography>
                )}

                {/* End of Comments Indicator */}
                {!hasMore && comments.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                        <Typography variant={'caption'} color={'text.secondary'}>
                            You've reached the end of the comments.
                        </Typography>
                    </Box>
                )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Comment Form Section */}
            {currentUser !== null ? (
                <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
            ) : (
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 1,
                        background: 'rgba(22, 27, 34, 0.2)',
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant={'body2'} color={'text.secondary'} sx={{ mb: 2 }}>
                        You must be signed in to post a comment.
                    </Typography>
                    <NextLink href={'/signin'} passHref style={{ textDecoration: 'none' }}>
                        <Button variant={'outlined'} color={'primary'} size={'small'}>
                            Sign In
                        </Button>
                    </NextLink>
                </Box>
            )}
        </Box>
    );
};
