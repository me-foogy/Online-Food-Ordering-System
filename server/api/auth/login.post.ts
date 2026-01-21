import {loginSchema} from '@/shared/schemas/login'
import { signupSchema } from '@/shared/schemas/signup';
import { userArray } from '~/server/db';
import { setResponseStatus } from 'h3';
import {z} from 'zod';
import {db} from "@/drizzle/index"
import { usersTable } from '~/drizzle/schema';
import {eq} from 'drizzle-orm'

type baseLoginResponse = z.infer<typeof signupSchema> & {role: 'user'|'admin'}
type loginResponse = {success: true; message:Omit<baseLoginResponse,'password'> } | {success: false; message: string}

export default defineEventHandler(async(event)=>{
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

    if (user.password !== password) {
        setResponseStatus(event, 400);
        return { success: false, message: "Username and password do not match" };
    }

    setResponseStatus(event, 200);
    return {
        success: true,
        message: user,
    };

    
})