'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ITopicWithPosts } from '@/interfaces/ITopic';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import EditButton from '@/components/ui/buttons/EditButton';
import DeleteButton from '@/components/ui/buttons/DeleteButton';
import BackButton from '@/components/ui/buttons/BackButton';
import { deleteTopicAction, createPostAction } from '../action';
import { postSchema, PostInput } from '@/lib/validations/post';
import { CommentsSection } from '@/components/comments/CommentsSection';
import { IPost } from '@/interfaces/IPost';


interface SingleTopicPageClientProps {
    topic: Omit<ITopicWithPosts, 'posts'> & {
        posts: (IPost & {
            comments?: {
                id: number;
            }[];
        })[];
    };
    currentUser: {
        id: string;
        email: string;
        role: string;
    } | null;
}

const SingleTopicPageClient = ({ topic, currentUser }: SingleTopicPageClientProps) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
    const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    const toggleComments = (postId: number) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const { control, handleSubmit, reset, formState: { errors: postErrors, isSubmitting: isPostSubmitting } } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: '',
            body: '',
        },
    });

    const handleCreatePost = async (data: PostInput) => {
        try {
            await createPostAction(topic.id, data);
            reset();
            setIsComposerOpen(false);
        } catch (err) {
            console.error('Failed to create post:', err);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(handleCreatePost)();
        }
    };

    useEffect(() => {
        const element = descriptionRef.current;
        if (!element) return;

        const checkTruncation = () => {
            if (!isExpanded) {
                setShowButton(element.scrollHeight > element.clientHeight);
            }
        };

        // Run initial check
        checkTruncation();

        // Listen for screen resize (crucial for mobile/responsive design)
        window.addEventListener('resize', checkTruncation);
        return () => {
            window.removeEventListener('resize', checkTruncation);
        };
    }, [topic.description, isExpanded]);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteTopicAction(topic.id);
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    return (
        <Container maxWidth={'md'}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={4}>
                <BackButton href={'/topics'} />

                {currentUser?.role === 'admin' && (
                    <Stack direction={'row'} spacing={1}>
                        <EditButton href={`/topics/${topic.id}/edit`} />
                        <DeleteButton onClick={() => setIsDeleteOpen(true)} />
                    </Stack>
                )}
            </Stack>

            <Box
                sx={{
                    p: 4,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'rgba(22, 27, 34, 0.4)',
                    backdropFilter: 'blur(8px)',
                    mb: 6,
                }}
            >
                <Typography variant={'h2'} component={'h1'} gutterBottom={true} sx={{ fontWeight: 800 }}>
                    {topic.title}
                </Typography>
                <Typography
                    ref={descriptionRef}
                    variant={'body1'}
                    color={'text.secondary'}
                    sx={{
                        mb: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: isExpanded ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {topic.description}
                </Typography>
                {showButton && (
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        size={'small'}
                        sx={{ mt: 1.5, p: 0, minWidth: 0, textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </Button>
                )}
            </Box>

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                <Typography variant={'h4'} component={'h2'} gutterBottom={false}>
                    Posts
                </Typography>
                {currentUser !== null && (
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        onClick={() => setIsComposerOpen(!isComposerOpen)}
                    >
                        {isComposerOpen ? 'Cancel' : 'New Post'}
                    </Button>
                )}
            </Stack>

            <Collapse in={isComposerOpen} sx={{ mb: 4 }}>
                <Card variant={'outlined'} sx={{ background: 'rgba(22, 27, 34, 0.2)', border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Stack
                            component={'form'}
                            onSubmit={handleSubmit(handleCreatePost)}
                            onKeyDown={handleKeyDown}
                            spacing={3}
                        >
                            <Typography variant={'h6'} sx={{ fontWeight: 700 }}>
                                Create a New Post
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
                                        error={!!postErrors.title}
                                        helperText={postErrors.title ? postErrors.title.message : 'Title must be 2 or more characters long'}
                                    />
                                )}
                            />

                            <Controller
                                name={'body'}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={'Body'}
                                        variant={'outlined'}
                                        multiline={true}
                                        rows={4}
                                        fullWidth={true}
                                        error={!!postErrors.body}
                                        helperText={postErrors.body ? postErrors.body.message : 'Body must be 10 or more characters long'}
                                    />
                                )}
                            />

                            <Stack direction={'row'} spacing={2} justifyContent={'flex-end'}>
                                <Button
                                    variant={'outlined'}
                                    onClick={() => {
                                        reset();
                                        setIsComposerOpen(false);
                                    }}
                                    disabled={isPostSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type={'submit'}
                                    variant={'contained'}
                                    color={'primary'}
                                    disabled={isPostSubmitting}
                                >
                                    Submit Post
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Collapse>

            <Stack spacing={2} mt={2}>
                {topic.posts && [...topic.posts]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((post) => (
                        <Card
                            key={post.id}
                            variant={'outlined'}
                            sx={{
                                background: 'rgba(22, 27, 34, 0.2)',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                            }}
                        >
                            <CardContent>
                                <Stack direction={'column'} spacing={0.5}>
                                    <Typography 
                                        component={NextLink} 
                                        href={`/topics/${topic.id}/posts/${post.id}`}
                                        variant={'h6'}
                                        sx={{ 
                                            fontWeight: 600, 
                                            textDecoration: 'none', 
                                            color: 'primary.main',
                                            display: 'inline-block',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            }
                                        }}
                                    >
                                        {post.title}
                                    </Typography>
                                    <Typography variant={'caption'} color={'text.secondary'}>
                                        Posted on {new Date(post.createdAt).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </Typography>
                                </Stack>
                                <Typography 
                                    variant={'body2'} 
                                    color={'text.secondary'}
                                    sx={{ 
                                        mt: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {post.body}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Button
                                        size={'small'}
                                        onClick={() => toggleComments(post.id)}
                                        sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 600 }}
                                    >
                                        {expandedComments[post.id] ? 'Hide Comments' : `Comments (${post.comments?.length || 0})`}
                                    </Button>
                                </Box>

                                <Collapse in={!!expandedComments[post.id]} timeout={'auto'} unmountOnExit={true}>
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <CommentsSection postId={post.id} currentUser={currentUser} />
                                    </Box>
                                </Collapse>
                            </CardContent>
                        </Card>
                    ))}

                {(!topic.posts || topic.posts.length === 0) && (
                    <Typography color={'text.secondary'}>
                        No posts in this topic yet.
                    </Typography>
                )}
            </Stack>

            <DeleteConfirmDialog
                open={isDeleteOpen}
                title={'Delete Topic'}
                description={`Are you sure you want to delete "${topic.title}"? This action cannot be undone and will permanently delete all associated posts.`}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
        </Container>
    );
};

export default SingleTopicPageClient;