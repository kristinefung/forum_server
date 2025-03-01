import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '@prisma/client';

import { ApiError } from '../utils/err';
import { ApiStatusCode } from '../utils/enum';

export interface ICategoryService {
    createCategory(groupId: number, name: string, description: string): Promise<Category>;
    getCategoryById(categoryId: number): Promise<Category>;
    getAllCategories(): Promise<Category[]>;
    deleteCategoryById(categoryId: number): Promise<void>;
    updateCategoryById(categoryId: number, groupId: number, name: string, description: string): Promise<Category>;
}

export class CategoryService implements ICategoryService {
    constructor(
        private categoryRepo: CategoryRepository,
    ) { }

    async createCategory(groupId: number, name: string, description: string): Promise<Category> {
        // Step 1: Validate input


        // Step 2: Insert category into database
        const categoryRes = await this.categoryRepo.createCategory(groupId, name, description);

        return categoryRes;
    }

    async getCategoryById(categoryId: number): Promise<Category> {
        const category = await this.categoryRepo.getCategoryById(categoryId);
        if (!category) {
            throw new ApiError("Category not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return category;
    }

    async getAllCategories(): Promise<Category[]> {
        const categories = await this.categoryRepo.getAllCategories();
        return categories;
    }

    async deleteCategoryById(categoryId: number): Promise<void> {
        await this.categoryRepo.deleteCategoryById(categoryId);
        return;
    }

    async updateCategoryById(categoryId: number, groupId: number, name: string, description: string): Promise<Category> {
        // Step 0: Data validation

        // Step 1: Update category into database
        const categoryRes = await this.categoryRepo.updateCategoryById(categoryId, { groupId, name, description });

        return categoryRes;
    }
}