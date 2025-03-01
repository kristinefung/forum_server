import { Request, Response } from 'express';
import { CategoryGroupService } from '../services/category_group.service';
import { AuthService } from '../services/auth.service';
import { jsonResponse } from '../utils/jsonResponse';

export interface ICategoryGroupController {
    createCategoryGroup(req: Request, res: Response): void;
    getCategoryGroupById(req: Request, res: Response): void;
    getAllCategoryGroups(req: Request, res: Response): void;
    deleteCategoryGroupById(req: Request, res: Response): void;
    updateCategoryGroupById(req: Request, res: Response): void;
}

export class CategoryGroupController implements ICategoryGroupController {
    constructor(
        private categoryGroupServ: CategoryGroupService,
    ) { }

    async createCategoryGroup(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const { name, description } = req.body;
            const createdCategoryGroup = await this.categoryGroupServ.createCategoryGroup(name, description);

            // Step 2: return success response
            return jsonResponse(res, { categoryGroup: createdCategoryGroup }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getCategoryGroupById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const categoryGroupId = parseInt(req.params.id);
            const categoryGroup = await this.categoryGroupServ.getCategoryGroupById(categoryGroupId);

            // Step 2: return success response
            return jsonResponse(res, { categoryGroup: categoryGroup }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllCategoryGroups(req: Request, res: Response) {
        try {
            const categoryGroups = await this.categoryGroupServ.getAllCategoryGroups();
            return jsonResponse(res, { categoryGroups: categoryGroups }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteCategoryGroupById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const categoryGroupId = parseInt(req.params.id);
            await this.categoryGroupServ.deleteCategoryGroupById(categoryGroupId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateCategoryGroupById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const { name, description } = req.body;
            const categoryGroupId = parseInt(req.params.id);
            const categoryGroup = await this.categoryGroupServ.updateCategoryGroupById(categoryGroupId, name, description);
            return jsonResponse(res, { categoryGroup: categoryGroup }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}