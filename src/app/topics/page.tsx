import { getAllTopics } from '@/db/queries/topics';
import TopicsPageClient from './page.client';
import { ITopic } from '@/interfaces/ITopic';

export const dynamic = 'force-dynamic';

const TopicsPage = async () => {
    const topicsList: ITopic[] = await getAllTopics();

    return <TopicsPageClient topics={topicsList} />;
};

export default TopicsPage;