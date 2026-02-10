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

    if(!id){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'Category Id is required'
        }
    }

    const categoryId = Number(id);

    if(isNaN(categoryId)){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'Invalid Category Id'
        }
    }


    try{
        const response = await db.delete(categoryTable).where(eq(categoryTable.id, categoryId)).returning();

        if(response.length===0){
            setResponseStatus(event, 404);
            return{
                success: false, 
                message: 'No category Found'
            }
        }

        setResponseStatus(event, 200)
        return{
            success: true,
            message: response
        }

    } catch(err)
    {
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'Unexpected Error Occured'
        }
    }
})