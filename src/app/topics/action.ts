'use server';

import { addTopic, deleteTopic, updateTopic } from '@/db/queries/topics';
import { createPost, getPost, updatePost, deletePost } from '@/db/queries/posts';
import { TopicInput, topicSchema } from '@/lib/validations/topic';
import { PostInput, postSchema } from '@/lib/validations/post';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

// Helper to check authentication
const getSessionOrThrow = async () => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error('Unauthorized: You must be signed in to perform this action');
    }
    return session;
};

export const createTopicAction = async (data: TopicInput) => {
    await getSessionOrThrow();
    const result = topicSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const newTopic = await addTopic(result.data);

    revalidatePath('/topics');

    redirect(`/topics/${newTopic.id}`);
};

export const updateTopicAction = async (id: number, data: TopicInput) => {
    const session = await getSessionOrThrow();
    
    // Topics are global categories: only admins can edit/update them
    if (session.user.role !== 'admin') {
        throw new Error('Unauthorized: Only administrators can update topics');
    }

    const result = topicSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const updatedTopic = await updateTopic(id, result.data);

    revalidatePath('/topics');
    revalidatePath(`/topics/${id}`);

    redirect(`/topics/${updatedTopic.id}`);
};

export const deleteTopicAction = async (id: number) => {
    const session = await getSessionOrThrow();
    
    // Topics are global categories: only admins can delete them
    if (session.user.role !== 'admin') {
        throw new Error('Unauthorized: Only administrators can delete topics');
    }

    await deleteTopic(id);

    revalidatePath('/topics');

    redirect('/topics');
};

export const createPostAction = async (topicId: number, data: PostInput) => {
    const session = await getSessionOrThrow();
    const result = postSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const newPost = await createPost({
        title: result.data.title,
        body: result.data.body,
        topicId,
        userId: parseInt(session.user.id, 10),
    });

    revalidatePath(`/topics/${topicId}`);

    return newPost;
};

export const updatePostAction = async (postId: number, topicId: number, data: PostInput) => {
    const session = await getSessionOrThrow();
    const result = postSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const post = await getPost(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    // Allow edit only if user is author OR admin
    const isOwner = post.userId === parseInt(session.user.id, 10);
    const isAdmin = session.user.role === 'admin';
    if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You do not have permission to edit this post');
    }

    const updatedPost = await updatePost(postId, result.data);

    revalidatePath(`/topics/${topicId}`);
    revalidatePath(`/topics/${topicId}/posts/${postId}`);

    return updatedPost;
};

export const deletePostAction = async (postId: number, topicId: number) => {
    const session = await getSessionOrThrow();
    
    const post = await getPost(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    // Allow delete only if user is author OR admin
    const isOwner = post.userId === parseInt(session.user.id, 10);
    const isAdmin = session.user.role === 'admin';
    if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You do not have permission to delete this post');
    }

    await deletePost(postId);

    revalidatePath(`/topics/${topicId}`);

    redirect(`/topics/${topicId}`);
};