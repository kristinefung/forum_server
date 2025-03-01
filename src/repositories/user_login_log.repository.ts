import { PrismaClient, UserLoginLog } from '@prisma/client';

export interface IUserLoginLogRepository {
    createUserLoginLog(log: Partial<UserLoginLog>): Promise<UserLoginLog>;
}

export class UserLoginLogRepository implements IUserLoginLogRepository {
    constructor(
        private prismaClient: PrismaClient
    ) { }

    async createUserLoginLog(log: Partial<UserLoginLog>): Promise<UserLoginLog> {
        const createdUserLoginLog = await this.prismaClient.userLoginLog.create({
            data: {
                userId: log.userId ?? 0,
                ipAddress: log.ipAddress ?? "",
                userAgent: log.userAgent ?? "",
                sessionToken: log.sessionToken ?? "",
                loginAt: log.loginAt ?? new Date(),
                logoutAt: log.logoutAt,
            },
        });

        return createdUserLoginLog;
    }

}