import crypto from 'crypto';

export function generateOTP(length: number): string{

    const min = Math.pow(10, length - 1); // 100000 for 6 digits
    const max = Math.pow(10, length) - 1; // 999999 for 6 digits
    const otp = crypto.randomInt(min, max + 1);
    return otp.toString();
}