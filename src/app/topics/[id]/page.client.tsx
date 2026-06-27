'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import NextLink from 'next/link';
import { ITopicWithPosts } from '@/interfaces/ITopic';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import { deleteTopicAction } from '../action';


interface SingleTopicPageClientProps {
    topic: ITopicWithPosts;
}

const SingleTopicPageClient = ({ topic }: SingleTopicPageClientProps) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
                <Button component={NextLink} href={'/topics'} startIcon={<ArrowBackRounded />} variant={'outlined'} color={'primary'}>
                    Back to Topics
                </Button>

                <Stack direction={'row'} spacing={2}>
                    <Button component={NextLink} href={`/topics/${topic.id}/edit`} variant={'contained'} color={'primary'}>
                        Edit Topic
                    </Button>

                    <Button variant={'contained'} color={'error'} onClick={() => setIsDeleteOpen(true)}>
                        Delete Topic
                    </Button>
                </Stack>
            </Stack>

            <Typography variant={'h2'} component={'h1'} gutterBottom>
                {topic.title}
            </Typography>

            <Typography variant={'body1'} color={'text.secondary'} sx={{ mb: 6 }}>
                {topic.description}
            </Typography>

            <Typography variant={'h4'} component={'h2'} gutterBottom>
                Posts
            </Typography>

            <Stack spacing={2} mt={2}>
                {topic.posts && topic.posts.map((post) => (
                    <Button
                        key={post.id}
                        component={NextLink}
                        href={`/topics/${topic.id}/posts/${post.id}`}
                        variant={'outlined'}
                        color={'primary'}
                        sx={{ justifyContent: 'flex-start', textAlign: 'left', width: '100%' }}
                    >
                        {post.title}
                    </Button>
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