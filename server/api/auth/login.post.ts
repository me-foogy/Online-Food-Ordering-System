import {loginSchema} from '@/shared/schemas/login'
import { loginReturnMessageType, loginReturnType } from '@/shared/types/auth';
import { setResponseStatus, setCookie } from 'h3';
import {db} from "~/server/drizzle/index"
import { usersTable } from '~/server/drizzle/schema';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWTPayload} from '@/shared/types/auth'
import {z} from 'zod';

const JWT_SECRET = process.env.JWT_SECRET as string

if(!JWT_SECRET){
    throw new Error('JWT_Secret not defined');
}

type loginSuccess = {
    success: true
    message: loginReturnMessageType
}

type loginFail = {
    success: false
    message: string
}

export default defineEventHandler(async(event): Promise<loginSuccess | loginFail>=>{
    const body = await readBody(event);
    
    const validated = loginSchema.safeParse(body);
    if(!validated.success){
        setResponseStatus(event, 400);
        return {success: false, message: 'Form validation error'}
    }  

    const {email, password} = validated.data;
    
    //fetch user
    const [user]= await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (!user) {
        setResponseStatus(event, 400);
        return { success: false, message: "User not found" };
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        setResponseStatus(event, 401);
        return {success: false, message: "Invalid Credentials"};
    }
    
    //user is ok
    const payload: JWTPayload = {
        id: user.id,
        name: user.name, 
        email: user.email, 
        role: user.role as 'admin'|'user'
    }

    const audience = (user.role==='user')?'food-app-user':'food-app-admin'

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1d',
        issuer: 'food-app',
        audience
    })


    //Cookie Setup
    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
    })

    setResponseStatus(event, 200);

    return {
        success: true,
        message: {
            name: user.name,
            email: user.email, 
            address: user.address,
            phoneNo: user.phoneNo,
            role: user.role as 'admin' | 'user'
        },
    };
})