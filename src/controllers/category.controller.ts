import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { jsonResponse } from '../utils/jsonResponse';

export interface ICategoryController {
    createCategory(req: Request, res: Response): void;
    getCategoryById(req: Request, res: Response): void;
    getAllCategories(req: Request, res: Response): void;
    deleteCategoryById(req: Request, res: Response): void;
    updateCategoryById(req: Request, res: Response): void;
}

export class CategoryController implements ICategoryController {
    constructor(
        private categoryServ: CategoryService,
    ) { }

    async createCategory(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            // Step 1: Call service to handle business logic
            const { groupId, name, description } = req.body;
            const createdCategory = await this.categoryServ.createCategory(groupId, name, description);

            // Step 2: return success response
            return jsonResponse(res, { category: createdCategory }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getCategoryById(req: Request, res: Response) {
        try {
            // Step 1: Call service to handle business logic
            const categoryId = parseInt(req.params.id);
            const category = await this.categoryServ.getCategoryById(categoryId);

            // Step 2: return success response
            return jsonResponse(res, { category: category }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async getAllCategories(req: Request, res: Response) {
        try {
            const categorys = await this.categoryServ.getAllCategories();
            return jsonResponse(res, { categorys: categorys }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async deleteCategoryById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const categoryId = parseInt(req.params.id);
            await this.categoryServ.deleteCategoryById(categoryId);
            return jsonResponse(res, {}, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

    async updateCategoryById(req: Request, res: Response) {
        try {
            // await this.authServ.authUser([UserRole.ADMIN], req.headers.authorization);

            const { groupId, name, description } = req.body;
            const categoryId = parseInt(req.params.id);
            const category = await this.categoryServ.updateCategoryById(categoryId, groupId, name, description);
            return jsonResponse(res, { category: category }, null);
        } catch (err) {
            return jsonResponse(res, {}, err);
        }
    }

}