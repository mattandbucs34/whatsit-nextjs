import { IPost } from './IPost';

export interface ITopic {
    id: number;
    title: string;
    description: string;
    flairId?: number | null;
    flair?: {
        id: number;
        name: string | null;
        color?: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface ITopicWithPosts extends ITopic {
    posts: IPost[];
}
