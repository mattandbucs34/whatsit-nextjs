'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { ITopic } from '@/interfaces/ITopic';

const TopicsPageClient = ({ topics }: { topics: ITopic[] }) => {
    return (
        <Container>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={4}>
                <Typography component={'h1'} fontSize={'3rem'}>Topics</Typography>
                <Button
                    component={NextLink}
                    href={'/topics/new'}
                    variant={'contained'}
                    color={'primary'}
                >
                    Create Topic
                </Button>
            </Stack>

            <Stack spacing={2}>
                {topics.map((topic) => (
                    <Card key={topic.id}>
                        <CardContent>
                            <Typography variant={'h5'} component={'h2'} gutterBottom>
                                {topic.title}
                            </Typography>
                            <Typography variant={'body2'} color={'text.secondary'}>
                                {topic.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                component={NextLink}
                                href={`/topics/${topic.id}`}
                                size={'small'}
                                color={'primary'}
                            >
                                View Topic
                            </Button>
                        </CardActions>
                    </Card>
                ))}
                {topics.length === 0 && (
                    <Typography color={'text.secondary'} align={'center'}>
                        No topics found. Create one to get started!
                    </Typography>
                )}
            </Stack>
        </Container>
    );
};

export default TopicsPageClient;