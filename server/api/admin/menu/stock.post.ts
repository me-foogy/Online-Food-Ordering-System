/*
    API that toggles the in stock column of the table
*/

import {editmenuStockSchema} from '@/shared/schemas/menuItem'
import { setResponseStatus } from 'h3';
import {db} from "@/drizzle/index"
import { menuTable} from '~/drizzle/schema';
import {eq} from 'drizzle-orm'

export default defineEventHandler(async (event)=>{
    const body = await readBody(event);

    const validated = editmenuStockSchema.safeParse(body);
        if(!validated.success){
            setResponseStatus(event, 400);
            return{
                success: false,
                message: 'Data validation Error'
            }
        }

        const { id, inStock } = validated.data;
        
        const updatedStockItem = await db.update(menuTable).set({
            inStock
        }).where(eq(menuTable.id, id)).returning()

        if(updatedStockItem.length===0){
            setResponseStatus(event, 404)
            return {
                success: false,
                message: 'Item not found for edit'
            }
        }

        return{
            success: true,
            message: updatedStockItem
        }
})