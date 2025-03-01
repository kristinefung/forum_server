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

    async updateOtpById(id: number, otp: Partial<Otp>): Promise<void> {
        const updatedOtp = await this.prismaClient.otp.update({
            where: {
                id: id,
                isUsed: 0,
            },
            data: {
                isUsed: otp.isUsed,
            },
        });
    }

    async getOtpByEmail(email: string): Promise<Otp | null> {
        const otpRes = await this.prismaClient.otp.findFirst({
            where: {
                email: email,
                isUsed: 0,
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ],
        });

        return otpRes ? otpRes : null;
    }

}