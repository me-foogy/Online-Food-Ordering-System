/*
    Api to fetch all of the categories in the category Table
    Depends on Table - categoryTable
    input: none
    output: category Array
    response: {
        success: boolean - true for success
        message: Array | String - array for success
    }
*/

import { categoryTable } from "~/server/drizzle/schema";
import { db } from "~/server/drizzle";

export default defineEventHandler(async(event)=>{
        const category = await db.select().from(categoryTable);

    if(category.length===0){
        setResponseStatus(event, 204);
        return{
            success: true,
            message: []
        }
    }

    setResponseStatus(event, 200);
    return{
        success: true,
        message: category
    }
})