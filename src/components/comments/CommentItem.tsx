'use client';

import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { IComment } from '@/interfaces/IComment';
import { deleteCommentAction } from '@/app/comments/action';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';

interface CommentItemProps {
    comment: IComment;
    currentUser: {
        id: string;
        email: string;
        role: string;
    } | null;
    onDeleteSuccess: (id: number) => void;
}

export const CommentItem = ({ comment, currentUser, onDeleteSuccess }: CommentItemProps) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const isOwner = currentUser !== null && comment.userId === parseInt(currentUser.id, 10);
    const isAdmin = currentUser?.role === 'admin';
    const canDelete = isOwner || isAdmin;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCommentAction(comment.id);
            onDeleteSuccess(comment.id);
        } catch (err) {
            console.error('Failed to delete comment:', err);
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    return (
        <Card
            variant={'outlined'}
            sx={{
                background: 'rgba(22, 27, 34, 0.2)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                position: 'relative',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: 'rgba(88, 166, 255, 0.3)',
                    background: 'rgba(22, 27, 34, 0.35)',
                },
            }}
        >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'} spacing={2}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant={'body2'} color={'text.primary'} sx={{ mb: 1, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                            {comment.body}
                        </Typography>
                        <Typography variant={'caption'} color={'text.secondary'} sx={{ display: 'block' }}>
                            Comment by {comment.user?.email || 'guest@whatsit.com'} on {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Typography>
                    </Box>

                    {canDelete && (
                        <IconButton
                            size={'small'}
                            color={'error'}
                            onClick={() => setIsDeleteOpen(true)}
                            sx={{
                                opacity: 0.7,
                                transition: 'opacity 0.2s ease, transform 0.2s ease',
                                '&:hover': {
                                    opacity: 1,
                                    transform: 'scale(1.1)',
                                    background: 'rgba(248, 81, 73, 0.1)',
                                },
                            }}
                        >
                            <DeleteRoundedIcon fontSize={'small'} />
                        </IconButton>
                    )}
                </Stack>
            </CardContent>

            <DeleteConfirmDialog
                open={isDeleteOpen}
                title={'Delete Comment'}
                description={'Are you sure you want to delete this comment? This action cannot be undone.'}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </Card>
    );
};
