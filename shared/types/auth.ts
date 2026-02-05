import {z} from 'zod';
import type { loginSchema } from '../schemas/login';
import type { signupSchema } from '../schemas/signup';

export type JWTPayload = {
    id: number
    name: string
    email: string
    role: 'admin'|'user'
}

//api default response

export type defaultApiType<T> = {
    success: true,
    message: T
} | {
    success: false,
    message: string
}

//response from login api

export type loginReturnMessageType = {
    name: string, 
    email: string, 
    address: string, 
    phoneNo: string, 
    role: 'admin' | 'user'
}

//formData - Input for login
export type baseFormData = z.infer<typeof loginSchema>

export type loginFormData = baseFormData & {
    rememberMe: boolean
}

//signUpFormData - Input for signup
export type basesignUpData = z.infer<typeof signupSchema>
export type signUpData= Omit<basesignUpData, 'phoneNo'>&{
    phoneNo: string //converted to number by zod in validation declared string for binding
    confirmPassword: string
    termsAndCond: boolean
}
export type signUpResponse = {
    id: number
    email: string
    name: string
    role: 'admin'|'user'
}