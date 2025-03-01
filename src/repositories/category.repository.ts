import { PrismaClient, Category } from '@prisma/client';

export interface ICategoryRepository {
    createCategory(groupId: number, name: string, description: string): Promise<Category>;
    getCategoryById(id: number): Promise<Category | null>;
    getAllCategories(): Promise<Category[]>;
    deleteCategoryById(id: number): Promise<void>;
    updateCategoryById(id: number, user: Category): Promise<Category>;
}

export class CategoryRepository implements ICategoryRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createCategory(groupId: number, name: string, description: string): Promise<Category> {
        const createdCategory = await this.prismaClient.category.create({
            data: {
                groupId: groupId,
                name: name,
                description: description,

                createdAt: new Date(),
                createdBy: -1,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: 0,
            },
        });

        return createdCategory;
    }

    async getCategoryById(id: number): Promise<Category | null> {
        const category = await this.prismaClient.category.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return category ? category : null;
    }

    async getAllCategories(): Promise<Category[]> {
        const categories = await this.prismaClient.category.findMany({
            where: {
                deleted: 0
            },
        });
        return categories;
    }

    async deleteCategoryById(id: number): Promise<void> {
        const category = await this.prismaClient.category.update({
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

    async updateCategoryById(id: number, category: Partial<Category>): Promise<Category> {
        const updatedCategory = await this.prismaClient.category.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                groupId: category.groupId,
                name: category.name,
                description: category.description,
                createdAt: undefined,
                createdBy: undefined,
                updatedAt: new Date(),
                updatedBy: -1,
                deleted: undefined,
            },
        });

        return updatedCategory;
    }
}