import { PrismaClient } from '@prisma/client';

import { UserRepository } from '../repositories/user.repository';
import { OtpRepository } from '../repositories/otp.repository';
import { UserLoginLogRepository } from '../repositories/user_login_log.repository';

import { UserService } from '../services/user.service';

import { UserController } from '../controllers/user.controller';

import dotenv from 'dotenv';

export class IoCContainer {
    private prismaClient: PrismaClient;

    private userRepo: UserRepository;
    private otpRepo: OtpRepository;
    private userLoginLogRepo: UserLoginLogRepository;

    private userServ: UserService;

    private userCtlr: UserController;

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

        // Services
        this.userServ = new UserService(this.userRepo, this.otpRepo, this.userLoginLogRepo);

        // Controllers
        this.userCtlr = new UserController(this.userServ);
    }

    public getUserController(): UserController {
        return this.userCtlr;
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