import {z} from 'zod';

const category = ["Breakfast",  "Fast Food", "Sea Food", "Dinner", "Dessert", "Drinks"];

export const  menuItemSchema =  z.object({

    name: z.string(),
    category: z.enum(category),
    price: z.number(),
    description: z.string(),
    image: z.string()
})

export const editMenuItemSchema = menuItemSchema.extend({
    id: z.number()
})

export const editmenuStockSchema = menuItemSchema.extend({
    id: z.number(),
    inStock: z.boolean()
})