/*
This api handles get request for menu and fetches all the menu items from the server
*/

import { setResponseStatus } from 'h3';
import {db} from "@/drizzle/index"
import { menuTable} from '~/drizzle/schema';

export default defineEventHandler(async (event)=>{

    try{
        const menu = await db.select().from(menuTable);
        setResponseStatus(event, 200)
        return{
            success: true,
            message: menu
        }
    }
    catch(err){
        setResponseStatus(event, 500)
        return {
        success: false,
        message: 'Failed to fetch menu items'
        }
    }
})