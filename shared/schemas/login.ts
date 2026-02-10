import {z} from 'zod';

export const loginSchema = z.object({
    email: z.email('Invalid Email Address'),
    password: z.string()
        .regex(/[A-Z]/, 'Password Must contain at lease one capital letter')
        .regex(/[^A-Za-z0-9]/, 'Password Must contain at least one special character'),
    rememberMe: z.boolean().default(false)
})