import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { getTopic } from '@/db/queries/topics';
import SingleTopicPageClient from './page.client';

export const dynamic = 'force-dynamic';


interface SingleTopicPageProps {
    params: Promise<{ id: string }>;
}

const SingleTopicPage = async ({ params }: SingleTopicPageProps) => {
    const resolvedParams = await params;
    const topic = await getTopic(Number(resolvedParams.id));

    if (!topic) {
        return (
            <Container>
                <Typography variant={'h4'} component={'h1'} gutterBottom>
                    Topic not found
                </Typography>
            </Container>
        );
    }

    return (
        <SingleTopicPageClient topic={topic} />
    );
};

export default SingleTopicPage;