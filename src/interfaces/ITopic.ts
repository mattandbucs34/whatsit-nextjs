export interface ITopic {
    id: number;
    title: string;
    description: string;
    flairId?: number | null;
    createdAt: string;
    updatedAt: string;
}
