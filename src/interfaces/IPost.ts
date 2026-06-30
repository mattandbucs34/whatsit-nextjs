export interface IPost {
    id: number;
    title: string;
    body: string;
    topicId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IPostWithComments extends IPost {
    comments: IComment[];
}