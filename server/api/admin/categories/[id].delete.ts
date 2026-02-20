/*
    Delete a category in the category Table
    Depends on Table - categoryTable
    input: no specific input use route params
    output: deleted Category as data
    response: {
        success: boolean - true for success
        message: Array | String - array for success
    }
*/

import { categoryTable, usersTable } from "~/server/drizzle/schema";
import { db } from "~/server/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async(event)=>{

    const id = getRouterParam(event, 'id')
    const categoryId = Number(id);

    if(isNaN(categoryId)){
        throw createError({
            status: 400,
            statusMessage: 'Invalid Body',
            message: 'The bosy must contain valid id'
        })
    }

    const response = await db.delete(categoryTable).where(eq(categoryTable.id, categoryId)).returning();

    if(response.length===0){
        throw createError({
            status: 404,
            statusMessage: 'Not Found',
            message: 'The category is missing'
        })
    }

    setResponseStatus(event, 200)
    return{
        success: true,
        message: response
    }
})