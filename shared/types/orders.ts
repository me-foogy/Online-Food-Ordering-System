type orderProgessType = 'notStarted'|'inProgress'|'completed';

interface orderItem{
    id: number
    itemName: string,
    itemCategory: string,
    menuId: number,
    itemQuantity: number,
    eachItemPrice: number
}

export interface orderDataType {
    orderId: number,
    customerName: string,
    totalItems: number,
    totalAmount: number,
    createdAt: string,
    location: string,
    order: Array<orderItem>
    customerNotes: string,
    orderProgress:  orderProgessType
}