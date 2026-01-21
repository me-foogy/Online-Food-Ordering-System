import {loginSchema} from '@/shared/schemas/login'
import { signupSchema } from '@/shared/schemas/signup';
import { userArray } from '~/server/db';
import { setResponseStatus } from 'h3';
import {z} from 'zod';
 
type baseLoginResponse = z.infer<typeof signupSchema> & {role: 'user'|'admin'}
type loginResponse = {success: true; message:baseLoginResponse } | {success: false; message: string}

export default defineEventHandler(async(event)=>{
    const body = await readBody(event);

    
    const validated = loginSchema.safeParse(body);
    if(!validated.success){
        setResponseStatus(event, 400);
        return {success: false, message: 'Form validation error'}
    }

    const checkUser = userArray.find(user=>user.email===body.email);

    if(checkUser)
    {
        if(checkUser.password===body.password){
            setResponseStatus(event, 200);
            return {success: true, message:checkUser}
        }
        else{
            setResponseStatus(event, 400);
            return {success: false, message:'username and password do not match'}
        }
    }
    else{
        setResponseStatus(event, 400);
        return {success: false, message:'user not found'}
    }
})