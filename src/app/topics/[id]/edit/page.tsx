import { getTopic } from '@/db/queries/topics';
import EditTopicPageClient from './page.client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EditTopicPageProps {
    params: Promise<{ id: string }>;
}

const EditTopicPage = async ({ params }: EditTopicPageProps) => {
    const resolvedParams = await params;
    const topic = await getTopic(Number(resolvedParams.id));

    if (!topic) {
        notFound();
    }

    return <EditTopicPageClient topic={topic} />;
};

export default EditTopicPage;