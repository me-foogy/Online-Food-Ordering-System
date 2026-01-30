import {z} from 'zod';

export const signupSchema = z.object({
    email: z.email('Invalid Email Address'),

    password: z.string()
            .regex(/[A-Z]/, 'Password Must contain at lease one capital letter')
            .regex(/[^A-Za-z0-9]/, 'Password Must contain at least one special character'),

    name: z.string()
        .min(1, 'Name Cannot be Empty'),

    phoneNo: z.string()
            .min(10, 'Number must have 10 digits'),

    address:z.string()
            .min(5, 'Address Too Short'),
    
})