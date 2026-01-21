import {signupSchema} from '@/shared/schemas/signup';
import {userArray} from '@/server/db'
import { setResponseStatus } from 'h3';

export default defineEventHandler(async(event)=>{
    let body = await readBody(event);
    
    const validated = signupSchema.safeParse(body);
    if(!validated.success){
        setResponseStatus(event, 400);
        return {success: false, message:validated.error.message}
    }

    body =  {...body, role: 'user'} // manually set and added to database
    userArray.push(body);
    console.log(userArray);
    setResponseStatus(event, 200);
    return {success: true, message:body}
})