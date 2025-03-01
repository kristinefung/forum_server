import { ThreadRepository } from '../repositories/thread.repository';
import { Thread } from '@prisma/client';

import { ApiError } from '../utils/err';
import { ApiStatusCode } from '../utils/enum';

export interface IThreadService {
    createThread(categoryId: number, title: string): Promise<Thread>;
    getThreadById(threadId: number): Promise<Thread>;
    getAllThreads(): Promise<Thread[]>;
    deleteThreadById(threadId: number): Promise<void>;
    updateThreadById(threadId: number, categoryId: number, title: string): Promise<Thread>;
}

export class ThreadService implements IThreadService {
    constructor(
        private threadRepo: ThreadRepository,
    ) { }

    async createThread(categoryId: number, title: string): Promise<Thread> {
        // Step 1: Validate input


        // Step 2: Insert thread into database
        const threadRes = await this.threadRepo.createThread(categoryId, title);

        return threadRes;
    }

    async getThreadById(threadId: number): Promise<Thread> {
        const thread = await this.threadRepo.getThreadById(threadId);
        if (!thread) {
            throw new ApiError("Thread not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return thread;
    }

    async getAllThreads(): Promise<Thread[]> {
        const threads = await this.threadRepo.getAllThreads();
        return threads;
    }

    async deleteThreadById(threadId: number): Promise<void> {
        await this.threadRepo.deleteThreadById(threadId);
        return;
    }

    async updateThreadById(threadId: number, categoryId: number, title: string): Promise<Thread> {
        // Step 0: Data validation

        // Step 1: Update thread into database
        const threadRes = await this.threadRepo.updateThreadById(threadId, { categoryId, title });

        return threadRes;
    }
}