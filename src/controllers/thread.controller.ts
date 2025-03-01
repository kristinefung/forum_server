import { Request, Response } from 'express';
import { ThreadService } from '../services/thread.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';

export interface IThreadController {
    createThread(req: Request, res: Response): void;
    getThreadById(req: Request, res: Response): void;
    getAllThreads(req: Request, res: Response): void;
    deleteThreadById(req: Request, res: Response): void;
    updateThreadById(req: Request, res: Response): void;
}

export class ThreadController implements IThreadController {
    constructor(
        private threadServ: ThreadService,
    ) { }

    async createThread(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const { categoryId, title } = req.body;
            const createdThread = await this.threadServ.createThread(categoryId, title);

            // Step 2: return success response
            return jsonResponse(res, { thread: createdThread }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getThreadById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const threadId = parseInt(req.params.id);
            const thread = await this.threadServ.getThreadById(threadId);

            // Step 2: return success response
            return jsonResponse(res, { thread: thread }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllThreads(req: Request, res: Response) {
        try {
            const threads = await this.threadServ.getAllThreads();
            return jsonResponse(res, { threads: threads }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteThreadById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const threadId = parseInt(req.params.id);
            await this.threadServ.deleteThreadById(threadId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateThreadById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const { categoryId, title } = req.body;
            const threadId = parseInt(req.params.id);
            const thread = await this.threadServ.updateThreadById(threadId, categoryId, title);
            return jsonResponse(res, { thread: thread }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}