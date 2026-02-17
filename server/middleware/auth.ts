import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/shared/types/auth';
import { defineEventHandler, getCookie, setResponseStatus } from 'h3';

const JWT_SECRET = process.env.JWT_SECRET
if(!JWT_SECRET) throw new Error('JWT_SECRET missing');

const issuer = 'food-app';
const publicRoutes = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/verify_signup',
    '/api/auth/reset'
]

export default defineEventHandler ((event)=>{
    const path = event.path

    if(!path.startsWith('/api')) return

    if(publicRoutes.some((route)=>path.startsWith(route))) return 

    //fetch cookie and the jwt token
    const token = getCookie(event, 'auth_token');

    if(!token){
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    let decoded: JWTPayload;

    try{
        decoded= jwt.verify(token, JWT_SECRET,{
            issuer
        }) as JWTPayload
    } catch{
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired token'
        })
    }

    if(!decoded.role || !decoded.id){
        throw createError({
            statusCode: 401,
            statusMessage: 'Corrupt token'
        })
    }

    if(path.startsWith('/api/admin')&& decoded.role!=='admin'){
        throw createError({
            statusCode: 403,
            statusMessage: 'Admin access only'
        })
    }

    if(path.startsWith('/api/user')&&decoded.role!=='user'){
        throw createError({
            statusCode: 403,
            statusMessage: 'User access only'
        })
    }
    event.context.user = decoded;
})