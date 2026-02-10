/*
    Handles Two Post Requests: Add and Edit
    Add - Add items to the menu
    Edit - Edit Existing Items in menu
    
    Add/Edit Workflow Differentiated by param parameters
    /add - add to the menu
    /edit - edit to the menu
*/

import {menuItemSchema, editMenuItemSchema} from '@/shared/schemas/menuItem'
import { setResponseStatus } from 'h3';
import {db} from "~/server/drizzle/index"
import { menuTable} from '~/server/drizzle/schema';
import {eq} from 'drizzle-orm'

export default defineEventHandler(async (event)=>{
    const body = await readBody(event);
    const action = getRouterParam(event, 'action');
    
    //check if action is edit or add only

    if(action=='add') return handleAdd(body);  //handle add
    else if(action == 'edit') return handleEdit(body); //handle edit
    else{
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'Action Other than add and edit received'
        }
    }

    async function handleAdd(body: unknown) { //unknown type can be used here as it is validated using zod before using the value

        //zod validation
        const validated = menuItemSchema.safeParse(body);
        if(!validated.success){
            setResponseStatus(event, 400);
            return{
                success: false,
                message: 'Data validation Error'
            }
        }

        const {name, category, price, description, image } = validated.data
        //check if item already exists in the database
        const existingItem = await db.select({id: menuTable.id}).from(menuTable).where(eq(menuTable.name, name));
        if(existingItem.length>0){
            setResponseStatus(event, 409);
            return{
                success: false,
                message: 'Item already exits in database'
            }
        }

        //upload items to databse
        const item = await db.insert(menuTable).values({
            name,
            category,
            price,
            description, 
            image
        }).returning()

        setResponseStatus(event, 201);
        return {
            success: true,
            message: item
        }
    }


    async function handleEdit(body: unknown){
        const validated = editMenuItemSchema.safeParse(body);
        if(!validated.success){
            setResponseStatus(event, 400);
            return{
                success: false,
                message: 'Data validation Error'
            }
        }

        const { id, name, category, price, description, image } = validated.data;
        
        const updatedItem = await db.update(menuTable).set({
            name, 
            category, 
            price,
            description,
            image
        }).where(eq(menuTable.id, id)).returning()

        if(updatedItem.length===0){
            setResponseStatus(event, 404)
            return {
                success: false,
                message: 'Item not found for edit'
            }
        }

        return{
            success: true,
            message: updatedItem
        }
    }


})