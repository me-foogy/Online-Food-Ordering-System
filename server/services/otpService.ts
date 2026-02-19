import crypto from 'crypto';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;

export function generateOTP(length: number): string{

    const min = Math.pow(10, length - 1); // 100000 for 6 digits
    const max = Math.pow(10, length) - 1; // 999999 for 6 digits
    const otp = crypto.randomInt(min, max + 1);
    return otp.toString();
}

export async function generateOTPHash(length: number): Promise<{
    hashedOTP: string
    OTP: string
}>{
    const min = Math.pow(10, length - 1); // 100000 for 6 digits
    const max = Math.pow(10, length) - 1; // 999999 for 6 digits
    const otp = crypto.randomInt(min, max + 1);

    //otp hashing
    const hashedOTP = await bcrypt.hash(otp.toString(), SALT_ROUNDS)
    return {
        hashedOTP,
        OTP: otp.toString()
    };
}