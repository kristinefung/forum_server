import { CategoryGroupRepository } from '../repositories/category_group.repository';
import { CategoryGroup } from '@prisma/client';

import { ApiError } from '../utils/err';
import { ApiStatusCode } from '../utils/enum';

export interface ICategoryGroupService {
    createCategoryGroup(name: string, description: string): Promise<CategoryGroup>;
    getCategoryGroupById(categoryGroupId: number): Promise<CategoryGroup>;
    getAllCategoryGroups(): Promise<CategoryGroup[]>;
    deleteCategoryGroupById(categoryGroupId: number): Promise<void>;
    updateCategoryGroupById(categoryGroupId: number, name: string, description: string): Promise<CategoryGroup>;
}

export class CategoryGroupService implements ICategoryGroupService {
    constructor(
        private categoryGroupRepo: CategoryGroupRepository,
    ) { }

    async createCategoryGroup(name: string, description: string): Promise<CategoryGroup> {
        // Step 1: Validate input


        // Step 2: Insert categoryGroup into database
        const categoryGroupRes = await this.categoryGroupRepo.createCategoryGroup(name, description);

        return categoryGroupRes;
    }

    async getCategoryGroupById(categoryGroupId: number): Promise<CategoryGroup> {
        const categoryGroup = await this.categoryGroupRepo.getCategoryGroupById(categoryGroupId);
        if (!categoryGroup) {
            throw new ApiError("CategoryGroup not existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }
        return categoryGroup;
    }

    async getAllCategoryGroups(): Promise<CategoryGroup[]> {
        const categoryGroups = await this.categoryGroupRepo.getAllCategoryGroups();
        return categoryGroups;
    }

    async deleteCategoryGroupById(categoryGroupId: number): Promise<void> {
        await this.categoryGroupRepo.deleteCategoryGroupById(categoryGroupId);
        return;
    }

    async updateCategoryGroupById(categoryGroupId: number, name: string, description: string): Promise<CategoryGroup> {
        // Step 0: Data validation

        // Step 1: Update categoryGroup into database
        const categoryGroupRes = await this.categoryGroupRepo.updateCategoryGroupById(categoryGroupId, { name, description });

        return categoryGroupRes;
    }
}