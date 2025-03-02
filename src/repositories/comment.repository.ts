import { PrismaClient, Comment } from '@prisma/client';

export interface ICommentRepository {
    createComment(parentCommentId: number, threadId: number, userId: number, content: string, sequence: number): Promise<Comment>;
    getCommentById(id: number): Promise<Comment | null>;
    getAllComments(): Promise<Comment[]>;
    findCommentsByThreadId(threadId: number): Promise<Comment[]>
    getNextSequenceByThreadId(threadId: number): Promise<number>
    deleteCommentById(id: number): Promise<void>;
    updateCommentById(id: number, comment: Partial<Comment>): Promise<Comment>;
}

export class CommentRepository implements ICommentRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createComment(parentCommentId: number, threadId: number, userId: number, content: string, sequence: number): Promise<Comment> {
        const createdComment = await this.prismaClient.comment.create({
            data: {
                parentCommentId: parentCommentId,
                threadId: threadId,
                userId: userId,
                content: content,
                sequence: sequence,

                createdAt: new Date(),
                createdBy: -1,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: 0,
            },
        });

        return createdComment;
    }

    async getCommentById(id: number): Promise<Comment | null> {
        const comment = await this.prismaClient.comment.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return comment ? comment : null;
    }

    async getAllComments(): Promise<Comment[]> {
        const comments = await this.prismaClient.comment.findMany({
            where: {
                deleted: 0
            },
        });
        return comments;
    }

    async findCommentsByThreadId(threadId: number): Promise<Comment[]> {
        const comments = await this.prismaClient.comment.findMany({
            where: {
                threadId: threadId,
                deleted: 0
            },
        });
        return comments;
    }

    async getNextSequenceByThreadId(threadId: number): Promise<number> {
        const comment = await this.prismaClient.comment.findFirst({
            where: {
                threadId: threadId,
                deleted: 0
            },
            orderBy: [
                {
                    sequence: 'desc',
                }
            ],
        });
        return comment?.sequence ? comment.sequence + 1 : 1;
    }

    async deleteCommentById(id: number): Promise<void> {
        const comment = await this.prismaClient.comment.update({
            where: {
                id: id,
                deleted: 0
            },
            data: {
                deleted: 1
            },
        });
        return;
    }

    async updateCommentById(id: number, comment: Partial<Comment>): Promise<Comment> {
        const updatedComment = await this.prismaClient.comment.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                parentCommentId: comment.parentCommentId,
                threadId: comment.threadId,
                userId: comment.userId,
                content: comment.content,
                sequence: comment.sequence,

                createdAt: undefined,
                createdBy: undefined,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: undefined,
            },
        });

        return updatedComment;
    }
}