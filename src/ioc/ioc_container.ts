import { PrismaClient } from '@prisma/client';

import { UserRepository } from '../repositories/user.repository';
import { OtpRepository } from '../repositories/otp.repository';
import { UserLoginLogRepository } from '../repositories/user_login_log.repository';
import { CategoryGroupRepository } from '../repositories/category_group.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { ThreadRepository } from '../repositories/thread.repository';

import { UserService } from '../services/user.service';
import { CategoryGroupService } from '../services/category_group.service';
import { CategoryService } from '../services/category.service';
import { ThreadService } from '../services/thread.service';

import { UserController } from '../controllers/user.controller';
import { CategoryGroupController } from '../controllers/category_group.controller';
import { CategoryController } from '../controllers/category.controller';
import { ThreadController } from '../controllers/thread.controller';

import dotenv from 'dotenv';

export class IoCContainer {
    private prismaClient: PrismaClient;

    private userRepo: UserRepository;
    private otpRepo: OtpRepository;
    private userLoginLogRepo: UserLoginLogRepository;
    private categoryGroupRepo: CategoryGroupRepository;
    private categoryRepo: CategoryRepository;
    private threadRepo: ThreadRepository;

    private userServ: UserService;
    private categoryGroupServ: CategoryGroupService;
    private categoryServ: CategoryService;
    private threadServ: ThreadService;

    private userCtlr: UserController;
    private categoryGroupCtlr: CategoryGroupController;
    private categoryCtlr: CategoryController;
    private threadCtlr: ThreadController;

    constructor() {

        // Validate environment variables
        dotenv.config();
        this._validateEnvVariables();

        // Prisma Client
        this.prismaClient = new PrismaClient();

        // Repositories
        this.userRepo = new UserRepository(this.prismaClient);
        this.otpRepo = new OtpRepository(this.prismaClient);
        this.userLoginLogRepo = new UserLoginLogRepository(this.prismaClient);
        this.categoryGroupRepo = new CategoryGroupRepository(this.prismaClient);
        this.categoryRepo = new CategoryRepository(this.prismaClient);
        this.threadRepo = new ThreadRepository(this.prismaClient);

        // Services
        this.userServ = new UserService(this.userRepo, this.otpRepo, this.userLoginLogRepo);
        this.categoryGroupServ = new CategoryGroupService(this.categoryGroupRepo);
        this.categoryServ = new CategoryService(this.categoryRepo);
        this.threadServ = new ThreadService(this.threadRepo);

        // Controllers
        this.userCtlr = new UserController(this.userServ);
        this.categoryGroupCtlr = new CategoryGroupController(this.categoryGroupServ);
        this.categoryCtlr = new CategoryController(this.categoryServ);
        this.threadCtlr = new ThreadController(this.threadServ);
    }

    public getUserController(): UserController {
        return this.userCtlr;
    }

    public getCategoryGroupController(): CategoryGroupController {
        return this.categoryGroupCtlr;
    }

    public getCategoryController(): CategoryController {
        return this.categoryCtlr;
    }

    public getThreadController(): ThreadController {
        return this.threadCtlr;
    }

    // TODO: Seems not easy to manage #refactor
    private _validateEnvVariables(): void {
        const requiredEnvVars = [
            'DATABASE_URL',
            'PORT',
            'JWT_SECRET_KEY'
        ];

        requiredEnvVars.forEach((varName) => {
            if (!process.env[varName]) {
                throw new Error(`Environment variable ${varName} is not set`);
            }
        });
    }
}