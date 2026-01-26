import {defineStore} from 'pinia';

interface menuType {
    id?: number
    name?: string,
    category?: string,
    price?: number,
    description?: string
    image?: string
    inStock?: boolean
}

interface cartDataType {
    id: number,
    name: string,
    category: string,
    price: number,
    image: string,
    quantity: number
}


export const useCartStore = defineStore('cart', {
    state: ()=>({
        cartItems: [
            {
                id: 1,
                name: 'Chicken Momo',
                category: 'Fast Food',
                price: 220,
                image: 'https://images.unsplash.com/photo-1738608084602-f9543952188e?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                quantity:1
            },
            {
                id: 2,
                name: 'Veg Chowmein',
                category: 'Fast Food',
                price: 180,
                image: 'https://images.unsplash.com/photo-1617622141573-2e00d8818f3f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                quantity:1
            }
        ]
    }),

    getters:{
        totalAmount: (state)=>{
            return state.cartItems.reduce((sum:number, currentItem:cartDataType)=>{
            return sum+(currentItem.price*currentItem.quantity)
        }, 0)
        }
    },

    actions:{
        addToCart(item: menuType){
            const {id, name, category, price, image} = item;
            if(id && name && category && price && image)
            {
                if(this.cartItems.find(cartItem=>cartItem.id === item.id)) console.error('Item already added to cart');
                else{
                    this.cartItems.push({
                        id: id,
                        name: name,
                        category: category,
                        price: price,
                        image: image,
                        quantity: 1
                    });
                }
            }
            else{
                console.error('Error Adding Item To cart');
            }
        },

        updateQuantity(quantityAndId: {quantity: number, id: number}){
            this.cartItems = this.cartItems.map(EachCartItem=>
            (
            EachCartItem.id===quantityAndId.id)
            ?
            {   ...EachCartItem,
                quantity: quantityAndId.quantity
            }
            :
            EachCartItem
            )
        },

        removeFromCart(id: number){
             this.cartItems = this.cartItems.filter(eachItem=>eachItem.id!==id);
        },

        orderAgain(item: cartDataType){
            const index = this.cartItems.findIndex(cartItem => cartItem.name === item.name);
            if (index !== -1 && this.cartItems[index]) {
                //add to quantity as items exist
                // Replace the object to trigger reactivity
                this.cartItems[index] = {
                    ...this.cartItems[index],
                    quantity: this.cartItems[index].quantity + item.quantity
                };
            } else {
                this.cartItems.push({ ...item }); //push new
            }
        }

    }
})