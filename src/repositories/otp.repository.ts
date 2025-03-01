import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { Otp } from '@prisma/client';

export interface IOtpRepository {
    createOtp(otp: Otp): Promise<Otp>;
}

export class OtpRepository implements IOtpRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createOtp(otp: Partial<Otp>): Promise<Otp> {
        const createdOtp = await this.prismaClient.otp.create({
            data: {
                email: otp.email!,
                otp: otp.otp!,
                createdAt: new Date(),
                expiredAt: otp.expiredAt!,
                isUsed: otp.isUsed,
            },
        });

        return createdOtp;
    }

}