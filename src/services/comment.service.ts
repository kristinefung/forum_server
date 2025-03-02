import { CommentRepository } from '../repositories/comment.repository';
import { Comment } from '@prisma/client';

import { ApiError } from '../utils/err';
import { ApiStatusCode } from '../utils/enum';

export interface ICommentService {
    createComment(parentCommentId: number, threadId: number, userId: number, content: string,): Promise<Comment>;
    getCommentById(commentId: number): Promise<Comment>;
    getAllComments(): Promise<Comment[]>;
    deleteCommentById(commentId: number): Promise<void>;
    updateCommentById(commentId: number, threadId: number, content: string): Promise<Comment>;
}

export class CommentService implements ICommentService {
    constructor(
        private commentRepo: CommentRepository,
    ) { }

    async createComment(parentCommentId: number, threadId: number, userId: number, content: string,): Promise<Comment> {
        // Step 1: Validate input


        // Step 2: Insert comment into database
        const nextSequence = await this.commentRepo.getNextSequenceByThreadId(threadId);

        const commentRes = await this.commentRepo.createComment(
            parentCommentId,
            threadId,
            userId,
            content,
            nextSequence
        );

        return commentRes;
    }

    async getCommentById(commentId: number): Promise<Comment> {
        const comment = await this.commentRepo.getCommentById(commentId);
        if (!comment) {
            throw new ApiError("Comment not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return comment;
    }

    async getAllComments(): Promise<Comment[]> {
        const comments = await this.commentRepo.getAllComments();
        return comments;
    }

    async deleteCommentById(commentId: number): Promise<void> {
        await this.commentRepo.deleteCommentById(commentId);
        return;
    }

    async updateCommentById(commentId: number, threadId: number, content: string): Promise<Comment> {
        // Step 0: Data validation

        // Step 1: Update comment into database
        const commentRes = await this.commentRepo.updateCommentById(commentId, { threadId, content });

        return commentRes;
    }
}