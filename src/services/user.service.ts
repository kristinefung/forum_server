import { UserRepository } from '../repositories/user.repository';
import { OtpRepository } from '../repositories/otp.repository';
import { User } from '../entities/user.entity';

import { sendVerificationEmail } from '../adapters/mailgun';

import { ApiError } from '../utils/err';
import { genRandomString, getRandomDigit } from '../utils/common';
import { ApiStatusCode } from '../utils/enum';
import { hashPassword, verifyPassword } from '../utils/security';

export interface IUserService {
    createUser(userReq: User): Promise<User>;
    login(userReq: User): Promise<string>;
}

export class UserService implements IUserService {
    constructor(
        private userRepo: UserRepository,
        private otpRepo: OtpRepository,
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

    async login(userReq: User): Promise<string> {
        // Step 0: Data validation
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
        // const token = await this.authServ.generateUserSessionToken(dbUser.id!);
        const token = "";

        return token;
    }
}