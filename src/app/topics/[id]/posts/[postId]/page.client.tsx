'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import BackButton from '@/components/ui/buttons/BackButton';
import DeleteButton from '@/components/ui/buttons/DeleteButton';
import { postSchema, PostInput } from '@/lib/validations/post';
import { updatePostAction, deletePostAction } from '@/app/topics/action';
import { CommentsSection } from '@/components/comments/CommentsSection';

// Strong typing for the post object returned from Drizzle query
interface SinglePostPageClientProps {
    post: {
        id: number;
        title: string;
        body: string;
        topicId: number;
        userId: number;
        createdAt: string;
        updatedAt: string;
        user: {
            email: string;
        } | null;
        comments?: {
            id: number;
            body: string;
            createdAt: string;
            user: {
                email: string;
            } | null;
        }[];
    };
    topicId: number;
    currentUser: {
        id: string;
        email: string;
        role: string;
    } | null;
}

const SinglePostPageClient = ({ post, topicId, currentUser }: SinglePostPageClientProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const canEditOrDelete = currentUser !== null && (
        currentUser.role === 'admin' ||
        post.userId === parseInt(currentUser.id, 10)
    );

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: post.title,
            body: post.body,
        },
    });

    const handleUpdate = async (data: PostInput) => {
        try {
            await updatePostAction(post.id, topicId, data);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update post:', err);
        }
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePostAction(post.id, topicId);
        } catch (err) {
            console.error('Failed to delete post:', err);
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(handleUpdate)();
        }
    };

    return (
        <Container maxWidth={'md'}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={4}>
                <BackButton href={`/topics/${topicId}`} />

                <Stack direction={'row'} spacing={1}>
                    {canEditOrDelete && !isEditing && (
                        <>
                            <IconButton
                                onClick={() => {
                                    reset({ title: post.title, body: post.body });
                                    setIsEditing(true);
                                }}
                                color={'primary'}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'rgba(88, 166, 255, 0.25)',
                                    background: 'rgba(88, 166, 255, 0.12)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: 0.75,
                                }}
                            >
                                <EditRoundedIcon />
                            </IconButton>
                            <DeleteButton onClick={() => setIsDeleteOpen(true)} />
                        </>
                    )}
                </Stack>
            </Stack>

            <Card
                variant={'outlined'}
                sx={{
                    background: 'rgba(22, 27, 34, 0.4)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 4,
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {isEditing ? (
                        <Stack component={'form'} onSubmit={handleSubmit(handleUpdate)} onKeyDown={handleKeyDown} spacing={3}>
                            <Typography variant={'h5'} sx={{ fontWeight: 700 }}>
                                Edit Post
                            </Typography>

                            <Controller
                                name={'title'}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={'Post Title'}
                                        variant={'outlined'}
                                        fullWidth={true}
                                        error={!!errors.title}
                                        helperText={errors.title ? errors.title.message : ''}
                                    />
                                )}
                            />

                            <Controller
                                name={'body'}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={'Post Body'}
                                        variant={'outlined'}
                                        multiline={true}
                                        rows={6}
                                        fullWidth={true}
                                        error={!!errors.body}
                                        helperText={errors.body ? errors.body.message : ''}
                                    />
                                )}
                            />

                            <Stack direction={'row'} spacing={2} justifyContent={'flex-end'}>
                                <Button
                                    variant={'outlined'}
                                    onClick={() => {
                                        reset();
                                        setIsEditing(false);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type={'submit'}
                                    variant={'contained'}
                                    color={'primary'}
                                    disabled={isSubmitting}
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack spacing={2}>
                            <Typography variant={'h3'} component={'h1'} sx={{ fontWeight: 800 }}>
                                {post.title}
                            </Typography>

                            <Typography variant={'caption'} color={'text.secondary'}>
                                Posted by {post.user?.email || 'guest@whatsit.com'} on {new Date(post.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>

                            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', my: 1 }} />

                            <Typography variant={'body1'} color={'text.primary'} sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                {post.body}
                            </Typography>
                        </Stack>
                    )}
                </CardContent>
            </Card>

            <CommentsSection postId={post.id} currentUser={currentUser} />

            <DeleteConfirmDialog
                open={isDeleteOpen}
                title={'Delete Post'}
                description={`Are you sure you want to delete the post "${post.title}"? This action cannot be undone and will delete all comments associated with it.`}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
        </Container>
    );
};

export default SinglePostPageClient;
