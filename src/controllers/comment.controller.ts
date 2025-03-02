import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';

export interface ICommentController {
    createComment(req: Request, res: Response): void;
    getCommentById(req: Request, res: Response): void;
    getAllComments(req: Request, res: Response): void;
    deleteCommentById(req: Request, res: Response): void;
    updateCommentById(req: Request, res: Response): void;
}

export class CommentController implements ICommentController {
    constructor(
        private commentServ: CommentService,
    ) { }

    async createComment(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const { parentCommentId, threadId, userId, content } = req.body;
            const createdComment = await this.commentServ.createComment(parentCommentId, threadId, userId, content);

            // Step 2: return success response
            return jsonResponse(res, { comment: createdComment }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getCommentById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const commentId = parseInt(req.params.id);
            const comment = await this.commentServ.getCommentById(commentId);

            // Step 2: return success response
            return jsonResponse(res, { comment: comment }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllComments(req: Request, res: Response) {
        try {
            const comments = await this.commentServ.getAllComments();
            return jsonResponse(res, { comments: comments }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const commentId = parseInt(req.params.id);
            await this.commentServ.deleteCommentById(commentId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateCommentById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const { threadId, content } = req.body;
            const commentId = parseInt(req.params.id);
            const comment = await this.commentServ.updateCommentById(commentId, threadId, content);
            return jsonResponse(res, { comment: comment }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}