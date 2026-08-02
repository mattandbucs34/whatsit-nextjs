'use client';

import { useState, useOptimistic, useTransition, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import { voteAction } from '@/app/votes/action';
import { AuthModal } from '@/components/ui/AuthModal';

interface VoteControlProps {
    postId: number;
    initialScore: number;
    initialUserVote: number; // 1 (upvoted), -1 (downvoted), 0 (none)
    currentUser: { id: string } | null;
    topicId?: number;
    size?: 'small' | 'medium';
}

interface VoteState {
    score: number;
    userVote: number;
}

export const VoteControl = ({
    postId,
    initialScore,
    initialUserVote,
    currentUser,
    topicId,
    size = 'medium',
}: VoteControlProps) => {
    const [voteState, setVoteState] = useState<VoteState>({
        score: initialScore,
        userVote: initialUserVote,
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setVoteState({
            score: initialScore,
            userVote: initialUserVote,
        });
    }, [initialScore, initialUserVote]);

    const [isPending, startTransition] = useTransition();

    // Optimistic UI updates
    const [optimisticState, setOptimisticState] = useOptimistic(
        voteState,
        (current: VoteState, targetValue: 1 | -1): VoteState => {
            if (current.userVote === targetValue) {
                // Toggling off existing vote
                return {
                    score: current.score - targetValue,
                    userVote: 0,
                };
            } else if (current.userVote === -targetValue) {
                // Switching vote direction (-1 to +1 or +1 to -1)
                return {
                    score: current.score + targetValue * 2,
                    userVote: targetValue,
                };
            } else {
                // New vote
                return {
                    score: current.score + targetValue,
                    userVote: targetValue,
                };
            }
        }
    );

    const handleVote = (targetValue: 1 | -1) => {
        if (!currentUser) {
            setIsAuthModalOpen(true);
            return;
        }

        if (isPending) return;

        startTransition(async () => {
            setOptimisticState(targetValue);
            try {
                const updated = await voteAction(postId, targetValue, topicId);
                setVoteState(updated);
            } catch (err) {
                console.error('Failed to vote:', err);
            }
        });
    };

    const isUpvoted = optimisticState.userVote === 1;
    const isDownvoted = optimisticState.userVote === -1;

    const iconSize = size === 'small' ? 'small' : 'medium';
    const paddingY = size === 'small' ? '4px' : '6px';
    const paddingX = size === 'small' ? '12px' : '16px';

    return (
        <>
            <Stack
                direction={'row'}
                alignItems={'center'}
                sx={{
                    display: 'inline-flex',
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    overflow: 'hidden',
                }}
            >
                {/* Upvote Button with Score */}
                <Button
                    onClick={() => handleVote(1)}
                    disabled={isPending}
                    startIcon={
                        isUpvoted ? (
                            <ThumbUpRoundedIcon fontSize={iconSize} />
                        ) : (
                            <ThumbUpOutlinedIcon fontSize={iconSize} />
                        )
                    }
                    sx={{
                        color: isUpvoted ? 'primary.main' : 'text.primary',
                        fontWeight: 700,
                        textTransform: 'none',
                        py: paddingY,
                        pl: paddingX,
                        pr: '12px',
                        minWidth: 'auto',
                        borderRadius: '24px 0 0 24px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.12)',
                            color: 'primary.main',
                        },
                    }}
                >
                    <Typography
                        variant={size === 'small' ? 'caption' : 'body2'}
                        sx={{ fontWeight: 700, ml: 0.5 }}
                    >
                        {optimisticState.score}
                    </Typography>
                </Button>

                {/* Vertical Segment Divider */}
                <Box
                    sx={{
                        width: '1px',
                        height: size === 'small' ? '16px' : '20px',
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                />

                {/* Downvote Button */}
                <IconButton
                    size={size}
                    onClick={() => handleVote(-1)}
                    disabled={isPending}
                    sx={{
                        color: isDownvoted ? 'error.main' : 'text.primary',
                        py: paddingY,
                        px: '12px',
                        borderRadius: '0 24px 24px 0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.12)',
                            color: 'error.main',
                        },
                    }}
                    aria-label={'Downvote'}
                >
                    {isDownvoted ? (
                        <ThumbDownRoundedIcon fontSize={iconSize} />
                    ) : (
                        <ThumbDownOutlinedIcon fontSize={iconSize} />
                    )}
                </IconButton>
            </Stack>

            <AuthModal
                open={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};
