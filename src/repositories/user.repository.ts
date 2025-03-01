import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { User } from '../entities/user.entity';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    deleteUserById(id: number): Promise<void>;
    updateUserById(id: number, user: User): Promise<User>;
}

export class UserRepository implements IUserRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createUser(user: User): Promise<User> {
        const createdUser = await this.prismaClient.user.create({
            data: {
                username: user.username ?? "",
                email: user.email ?? "",
                hashedPassword: user.hashedPassword ?? "",
                passwordSalt: user.passwordSalt ?? "",
                roleId: user.roleId ?? UserRole.USER,
                statusId: user.statusId ?? UserStatus.NOT_VERIFIED,
                profileId: user.profileId ?? -1,
                createdAt: user.createdAt ?? new Date(),
                createdBy: user.createdBy ?? -1,
                updatedAt: user.updatedAt ?? new Date(),
                updatedBy: user.updatedBy ?? -1,
                deleted: user.deleted ?? 0,
            },
        });

        return new User(createdUser);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                email,
                deleted: 0
            },
        });

        return user ? new User(user) : null;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: id,
                deleted: 0
            },
        });
        return user ? new User(user) : null;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.prismaClient.user.findMany({
            where: {
                deleted: 0
            },
        });
        return users.map(user => new User(user));
    }

    async deleteUserById(id: number): Promise<void> {
        const user = await this.prismaClient.user.update({
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

    async updateUserById(id: number, user: User): Promise<User> {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id: id,
                deleted: 0,
            },
            data: {
                username: user.username ?? undefined,
                email: user.email ?? undefined,
                hashedPassword: user.hashedPassword ?? undefined,
                passwordSalt: undefined,
                roleId: user.roleId ?? undefined,
                statusId: user.statusId ?? undefined,
                profileId: user.profileId ?? undefined,
                createdAt: undefined,
                createdBy: undefined,
                updatedAt: new Date(),
                updatedBy: user.updatedBy ?? undefined,
                deleted: undefined,
            },
        });

        return new User(updatedUser);
    }
}