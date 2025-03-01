import { z } from 'zod';

import { ApiStatusCode } from '../utils/enum';
import { ApiError } from '../utils/err';
import { UserStatus, UserRole } from '@prisma/client';

import bcrypt from 'bcrypt';

export class User {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    hashedPassword?: string;
    passwordSalt?: string;
    roleId?: UserRole;
    statusId?: UserStatus;
    profileId?: number;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
    deleted?: number;

    constructor(data: Partial<User> = {}) {
        Object.assign(this, data);
    }

    hideSensitive(): User {
        const hiddenWord = "********";

        this.password = hiddenWord;
        this.hashedPassword = hiddenWord;
        this.passwordSalt = hiddenWord;
        return this;
    }

    async hashPassword(hashedPassword: string, salt: string): Promise<User> {
        this.passwordSalt = salt;
        this.hashedPassword = hashedPassword;

        return this;
    }

    async verifyPassword(dbUser: User): Promise<User> {
        const pw = this.hashedPassword + dbUser.passwordSalt!;

        const correct = await bcrypt.compare(pw, dbUser.hashedPassword!)
        if (!correct) {
            new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return this;
    }

    createInputToUser(): User {
        const user = this._validateInput(z.object(
            {
                username: z.string({ required_error: "username is required" }).min(1, "username is required"),
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                password: z.string({ required_error: "password is required" }).min(1, "password is required"),
            }
        ));
        Object.assign(this, user);

        this.roleId = UserRole.USER;
        this.statusId = UserStatus.NOT_VERIFIED;

        this.createdAt = new Date();
        this.createdBy = 9999;

        return this;
    }

    updateInputToUser(): User {
        const user = this._validateInput(z.object(
            {
                username: z.string().optional().nullable(),
                email: z.string().email("Invalid email address").optional().nullable(),
                plainPassword: z.string().optional().nullable(),
            }
        ));
        Object.assign(this, user);

        this.updatedAt = new Date();
        this.updatedBy = 9999;
        return this;
    }

    loginInputToUser(): User {
        const user = this._validateInput(z.object(
            {
                email: z.string({ required_error: "email is required" }).email("Invalid email address"),
                password: z.string({ required_error: "password is required" }),
            }
        ));
        Object.assign(this, user);
        return this;
    }

    private _validateInput(schema: z.ZodSchema): User {
        const result = schema.safeParse(this);

        if (!result.success) {
            const firstError = result.error.errors[0].message;
            throw new ApiError(firstError, ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        return result.data;
    }
}
