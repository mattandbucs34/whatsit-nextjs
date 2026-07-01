import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { getTopic } from '@/db/queries/topics';
import SingleTopicPageClient from './page.client';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';


interface SingleTopicPageProps {
    params: Promise<{ id: string }>;
}

const SingleTopicPage = async ({ params }: SingleTopicPageProps) => {
    const resolvedParams = await params;
    const topic = await getTopic(Number(resolvedParams.id));
    const session = await auth();

    if (!topic) {
        return (
            <Container>
                <Typography variant={'h4'} component={'h1'} gutterBottom>
                    Topic not found
                </Typography>
            </Container>
        );
    }

    const currentUser = session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.role,
    } : null;

    return (
        <SingleTopicPageClient topic={topic} currentUser={currentUser} />
    );
};

export default SingleTopicPage;