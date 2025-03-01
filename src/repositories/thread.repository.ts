import { PrismaClient, Thread } from '@prisma/client';

export interface IThreadRepository {
    createThread(categoryId: number, title: string): Promise<Thread>;
    getThreadById(id: number): Promise<Thread | null>;
    getAllThreads(): Promise<Thread[]>;
    deleteThreadById(id: number): Promise<void>;
    updateThreadById(id: number, thread: Partial<Thread>): Promise<Thread>;
}

export class ThreadRepository implements IThreadRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createThread(categoryId: number, title: string): Promise<Thread> {
        const createdThread = await this.prismaClient.thread.create({
            data: {
                categoryId: categoryId,
                title: title,

                createdAt: new Date(),
                createdBy: -1,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: 0,
            },
        });

        return createdThread;
    }

    async getThreadById(id: number): Promise<Thread | null> {
        const thread = await this.prismaClient.thread.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return thread ? thread : null;
    }

    async getAllThreads(): Promise<Thread[]> {
        const threads = await this.prismaClient.thread.findMany({
            where: {
                deleted: 0
            },
        });
        return threads;
    }

    async deleteThreadById(id: number): Promise<void> {
        const thread = await this.prismaClient.thread.update({
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

    async updateThreadById(id: number, thread: Partial<Thread>): Promise<Thread> {
        const updatedThread = await this.prismaClient.thread.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                categoryId: thread.categoryId,
                title: thread.title,
                createdAt: undefined,
                createdBy: undefined,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: undefined,
            },
        });

        return updatedThread;
    }
}