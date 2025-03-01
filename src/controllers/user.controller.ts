import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';
import { User } from '../entities/user.entity';
import { UserRole } from '../utils/enum';

export interface IUserController {
    createUser(req: Request, res: Response): void;
}

export class UserController implements IUserController {
    constructor(
        private userServ: UserService
    ) { }
    async createUser(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const userReq = new User(req.body);
            const createdUser = await this.userServ.createUser(userReq);

            // Step 2: return success response
            return jsonResponse(res, { user: createdUser }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}