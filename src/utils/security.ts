import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey = process.env.JWT_SECRET_KEY || "";

type JwtPayload = {
    userId: number,
    exp: number,
}

export async function hashPassword(plainPassword: string, salt: string): Promise<string> {
    const passwordWithSalt = plainPassword + salt;
    const hashedPassword = await bcrypt.hash(passwordWithSalt, 10);

    return hashedPassword;
}

export async function verifyPassword(plainPassword: string, salt: string, hashedPassword: string): Promise<boolean> {
    const data = plainPassword + salt;
    const correct = await bcrypt.compare(data, hashedPassword)

    return correct
}

export function generateUserSessionToken(userId: number): string {
    // Step 1: Sign JWT
    const payload: JwtPayload = {
        userId: userId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
    };

    const token = jwt.sign(payload, secretKey);

    return token;
};