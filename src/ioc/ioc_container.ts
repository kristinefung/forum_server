import { PrismaClient } from '@prisma/client';

import { UserRepository } from '../repositories/user.repository';
import { OtpRepository } from '../repositories/otp.repository';
import { UserLoginLogRepository } from '../repositories/user_login_log.repository';
import { CategoryGroupRepository } from '../repositories/category_group.repository';

import { UserService } from '../services/user.service';
import { CategoryGroupService } from '../services/category_group.service';

import { UserController } from '../controllers/user.controller';
import { CategoryGroupController } from '../controllers/category_group.controller';

import dotenv from 'dotenv';

export class IoCContainer {
    private prismaClient: PrismaClient;

    private userRepo: UserRepository;
    private otpRepo: OtpRepository;
    private userLoginLogRepo: UserLoginLogRepository;
    private categoryGroupRepo: CategoryGroupRepository;

    private userServ: UserService;
    private categoryGroupServ: CategoryGroupService;

    private userCtlr: UserController;
    private categoryGroupCtlr: CategoryGroupController;

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

        // Services
        this.userServ = new UserService(this.userRepo, this.otpRepo, this.userLoginLogRepo);
        this.categoryGroupServ = new CategoryGroupService(this.categoryGroupRepo);

        // Controllers
        this.userCtlr = new UserController(this.userServ);
        this.categoryGroupCtlr = new CategoryGroupController(this.categoryGroupServ);
    }

    public getUserController(): UserController {
        return this.userCtlr;
    }

    public getCategoryGroupController(): CategoryGroupController {
        return this.categoryGroupCtlr;
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