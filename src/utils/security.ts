import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey = process.env.JWT_SECRET_KEY || "";


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