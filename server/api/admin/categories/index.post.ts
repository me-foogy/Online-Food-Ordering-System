/*
    Upload a category in the category Table
    Depends on Table - categoryTable
    input: Catrgory String Body
    output: uploaded Category as data
    response: {
        success: boolean - true for success
        message: Array | String - array for success
    }
*/

import { categoryTable } from "~/server/drizzle/schema";
import { db } from "~/server/drizzle";

export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const {category} = body;

    const response = await db.insert(categoryTable).values({
        name: category
    }).returning({
        id: categoryTable.id,
        name: categoryTable.name
    });

    setResponseStatus(event, 200)
    return{
        success: true,
        message: response
    }
})