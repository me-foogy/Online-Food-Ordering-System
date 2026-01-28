export type cartDataType = {
    id: number,
    name: string,
    category: string,
    price: number,
    image: string,
    quantity: number
}

export type cartSchema = {
    id: number,
    userId: number, 
    menuId: number,
    quantity: number
}
