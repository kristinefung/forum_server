import { UserRepository } from '../repositories/user.repository';
import { OtpRepository } from '../repositories/otp.repository';
import { UserLoginLogRepository } from '../repositories/user_login_log.repository';

import { User } from '../entities/user.entity';

import { sendVerificationEmail } from '../adapters/mailgun';

import { ApiError } from '../utils/err';
import { genRandomString, getRandomDigit } from '../utils/common';
import { ApiStatusCode } from '../utils/enum';
import { hashPassword, verifyPassword, generateUserSessionToken } from '../utils/security';

import { UserStatus, UserRole } from '@prisma/client';

export interface IUserService {
    createUser(userReq: User): Promise<User>;
    verifyUser(email: string, otp: string): Promise<boolean>;
    login(userReq: User): Promise<string>;
}

export class UserService implements IUserService {
    constructor(
        private userRepo: UserRepository,
        private otpRepo: OtpRepository,
        private userLoginLogRepo: UserLoginLogRepository,
    ) { }

    async createUser(userReq: User): Promise<User> {
        // Step 0: Data validation
        let user = userReq.createInputToUser();

        // Step 1: Check user email not existed in database
        const dbUser = await this.userRepo.getUserByEmail(user.email!)
        if (dbUser) {
            throw new ApiError("User existed", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        // Step 2: Hash user password
        const salt = genRandomString(20);
        const hashedPassword = await hashPassword(user.password!, salt)
        user = await user.hashPassword(hashedPassword, salt);

        // Step 4: Insert user into database
        const userRes = await this.userRepo.createUser(user);

        // Step 5: Send verification email with OTP
        const otp = getRandomDigit(6);
        const currentDate = new Date();
        const createOtpRes = await this.otpRepo.createOtp({
            otp: otp,
            email: user.email,
            expiredAt: new Date(currentDate.setHours(currentDate.getHours() + 1)),
            isUsed: 0,
        })

        const sendEmailSuccess = await sendVerificationEmail(userRes.email!, otp);

        return userRes.hideSensitive();
    }

    async verifyUser(email: string, otp: string): Promise<boolean> {

        // Step 1: Check the OTP is correct
        const getOtpRes = await this.otpRepo.getOtpByEmail(email);
        if (getOtpRes?.otp !== otp) {
            console.error(`Incorrect OTP: Expected: ${getOtpRes?.otp}, Got ${otp}`);
            return false;
        }

        if (new Date() > getOtpRes?.expiredAt) {
            console.error(`OTP expired: Expired date: ${getOtpRes?.expiredAt}, Current ${new Date()}`);
            return false;
        }

        // Step 2: Update OTP to used
        const updateOtpRes = await this.otpRepo.updateOtpById(getOtpRes.id, { isUsed: 1 });

        // Step 3: Update User status to "ACTIVE"
        const getUserRes = await this.userRepo.getUserByEmail(email);
        const updateUserRes = await this.userRepo.updateUserById(
            getUserRes?.id!,
            new User({ ...getUserRes, statusId: UserStatus.ACTIVE })
        );

        return true;
    }

    async login(userReq: User): Promise<string> {
        // Step 0: Data validation
        console.log(typeof userReq);
        let user = userReq.loginInputToUser();

        // Step 1: Check if email and password are correct
        const dbUser = await this.userRepo.getUserByEmail(user.email!)
        if (!dbUser) {
            throw new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        const correct = await verifyPassword(user.password!, dbUser.passwordSalt!, dbUser.hashedPassword!)
        if (!correct) {
            throw new ApiError("Email or password incorrect", ApiStatusCode.INVALID_ARGUMENT, 400);
        }

        // Step 2: Generate user session token
        const sessionToken = generateUserSessionToken(dbUser.id!);
        const creatUserLoginLogRes = await this.userLoginLogRepo.createUserLoginLog({
            userId: dbUser.id,
            sessionToken: sessionToken,
            loginAt: new Date(),
        })

        return sessionToken;
    }
}