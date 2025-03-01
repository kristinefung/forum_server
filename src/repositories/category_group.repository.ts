import { PrismaClient, CategoryGroup } from '@prisma/client';

export interface ICategoryGroupRepository {
    createCategoryGroup(name: string, description: string): Promise<CategoryGroup>;
    getCategoryGroupById(id: number): Promise<CategoryGroup | null>;
    getAllCategoryGroups(): Promise<CategoryGroup[]>;
    deleteCategoryGroupById(id: number): Promise<void>;
    updateCategoryGroupById(id: number, user: CategoryGroup): Promise<CategoryGroup>;
}

export class CategoryGroupRepository implements ICategoryGroupRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createCategoryGroup(name: string, description: string): Promise<CategoryGroup> {
        const createdCategoryGroup = await this.prismaClient.categoryGroup.create({
            data: {
                name: name,
                description: description,

                createdAt: new Date(),
                createdBy: -1,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: 0,
            },
        });

        return createdCategoryGroup;
    }

    async getCategoryGroupById(id: number): Promise<CategoryGroup | null> {
        const categoryGroup = await this.prismaClient.categoryGroup.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return categoryGroup ? categoryGroup : null;
    }

    async getAllCategoryGroups(): Promise<CategoryGroup[]> {
        const categoryGroups = await this.prismaClient.categoryGroup.findMany({
            where: {
                deleted: 0
            },
        });
        return categoryGroups;
    }

    async deleteCategoryGroupById(id: number): Promise<void> {
        const categoryGroup = await this.prismaClient.categoryGroup.update({
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

    async updateCategoryGroupById(id: number, categoryGroup: Partial<CategoryGroup>): Promise<CategoryGroup> {
        const updatedCategoryGroup = await this.prismaClient.categoryGroup.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                name: categoryGroup.name,
                description: categoryGroup.description,
                createdAt: undefined,
                createdBy: undefined,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: undefined,
            },
        });

        return updatedCategoryGroup;
    }
}