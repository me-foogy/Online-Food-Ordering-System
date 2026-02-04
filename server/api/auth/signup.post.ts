import {signupSchema} from '@/shared/schemas/signup';
import {db} from "~/server/drizzle/index"
import { usersTable } from '~/server/drizzle/schema';
import {eq} from 'drizzle-orm'
import { setResponseStatus } from 'h3';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export default defineEventHandler(async(event)=>{
    let body = await readBody(event);
    
    const validated = signupSchema.safeParse(body);
    if(!validated.success){
        setResponseStatus(event, 400);
        return {success: false, message:validated.error.message}
    }

    const validatedWithRole =  {...validated.data, role: 'user'} // manually set and added to database

    const {email, password, name, phoneNo, address, role} = validatedWithRole;

    //password hashing

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    //duplicate email check
    const existing = await db.select({id: usersTable.id}).from(usersTable).where(eq(usersTable.email, email));
    if(existing.length>0){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'An account with the email already exists'
        }
    }

    //insert into db

    const user = await db.insert(usersTable).values({
        email,
        password: hashedPassword,
        name,
        phoneNo,
        address,
        role
    }).returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        role: usersTable.role
    });
    
    setResponseStatus(event, 200);
    return{
        success: true,
        message: user
    }
})