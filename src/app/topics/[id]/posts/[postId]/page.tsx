import { getPost } from '@/db/queries/posts';
import { notFound } from 'next/navigation';
import SinglePostPageClient from './page.client';

interface PageProps {
    params: Promise<{
        id: string;
        postId: string;
    }>;
}

const PostDetailPage = async ({ params }: PageProps) => {
    const { id: topicId, postId } = await params;

    const post = await getPost(Number(postId));

    if (!post) {
        notFound();
    }

    return (
        <SinglePostPageClient 
            post={post} 
            topicId={Number(topicId)} 
        />
    );
};

export default PostDetailPage;
