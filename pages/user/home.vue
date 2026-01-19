<script lang="ts" setup>
    
    import {ref} from 'vue';
    import { menuData } from '../admin/menudata';
    import MenuItem from '@/components/user/MenuItem.vue';
    import EachCartItem from '@/components/user/EachCartItem.vue';

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

    const cartData=ref<cartDataType[]>([
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

    ])
    
    const searchBarInput = ref<string>('');
    const foodOptions:string[] = ['All', 'Breakfast', 'Fast Food', 'Sea Food', 'Dinner', 'Dessert', 'Drinks'];
    const activeType = ref('All');
    const date = new Date();
    const formatedDate = `${date.getFullYear()} - ${date.getMonth()+1} - ${date.getDate()}`;

    const totalAmount = computed(()=>{
        return cartData.value.reduce((sum:number, currentItem:cartDataType)=>{
            return sum+(currentItem.price*currentItem.quantity)
        }, 0)
    })

    const filteredMenuData = computed(()=>{
        if(activeType.value==='All') return menuData.filter(item=>item.name.toLowerCase().includes(searchBarInput.value.toLowerCase()));
        return menuData.filter(item=> item.category===activeType.value && item.name.toLowerCase().includes(searchBarInput.value.toLowerCase()));
    })

    const addToCart=(item:menuType)=>{
        const {id, name, category, price, image} = item;
        if(id && name && category && price && image)
        {
            if(cartData.value.find(cartItem=>cartItem.id === item.id)) console.error('Item already added to cart');
            else{
                cartData.value.push({
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
    }

    const updateQuantity = (quantityAndId: {quantity: number, id: number}) => {
        cartData.value = cartData.value.map(EachCartItem=>
            (
            EachCartItem.id===quantityAndId.id)
            ?
            {   ...EachCartItem,
                quantity: quantityAndId.quantity
            }
            :
            EachCartItem
        )
    }

    const removeFromCart=(id:number)=>{
        cartData.value = cartData.value.filter(eachItem=>eachItem.id!==id);
    }
    
    definePageMeta({
        layout: 'user'
    })
</script>

<template>
    <div class="flex min-h-screen">
        <main class="flex-1 xl:mr-96">
            <!--The Top search Section-->
            <div class="bg-white border rounded-xl p-2 px-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-24 md:justify-between">

                <!-- Left: Icon + Name -->
                <div class="flex items-center gap-3 flex-shrink-0 min-w-0">
                    <span class="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-blue-600 flex-shrink-0">storefront</span>
                    <div class="leading-tight min-w-0">
                        <p class="text-xs sm:text-sm md:text-sm text-gray-500">{{formatedDate}}</p>
                        <p class="text-lg sm:text-xl md:text-lg font-semibold text-gray-800">
                            THE RESTAURANT
                        </p>
                    </div>
                </div>

                <!--Search -->
                    <form class="flex-1 min-w-0">
                        <input type="text" placeholder="Search food" v-model="searchBarInput"
                        class="h-11 w-full px-4 border border-gray-300 rounded-md text-sm sm:text-sm md:text-base text-gray-800 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        hover:border-blue-400 transition min-w-0"/>
                    </form>
            </div>

            <!--The Filter By Category Section-->
            <div class="space-y-4 mt-6">

                <h2 class="text-xl font-semibold text-gray-800">Manage Your Menu Items</h2>

                <div class="flex gap-3 flex-wrap">
                    <button v-for="type in foodOptions":key="type" @click="activeType = type"
                    class="px-2 py-2 min-w-[5rem] rounded-xl text-sm font-normal border transition
                    hover:border-blue-500 hover:translate-y-[1px]
                    sm:px-4 sm:min-w-[10rem] sm:font-medium"
                    :class="
                        activeType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    ">
                        {{ type }}
                    </button>
                </div>
            </div>

            <!--Each Menu Item-->
            <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 overflow-y-auto">
                <MenuItem v-for="item in filteredMenuData" :key="item.id" :item="item" @addToCart="addToCart"/>
            </div>
        </main>
        
        <!--Each Cart Item-->
        <aside class=" w-96 lg:w-96 bg-white border-l border-gray-200 p-4 fixed top-0 right-0 h-screen
                hidden xl:flex xl:flex-col xl:justify-between">

            <div class="flex-1 max-h-[90%] overflow-y-auto">
                <h2 class="text-lg font-semibold mb-4 pl-4">My Order</h2>
                <div class=" space-y-2">
                    <EachCartItem v-for="item in cartData" :item="item" @removeFromCart="removeFromCart" @updateQuantity="updateQuantity"/>
                </div>
            </div>

            <div class="border-t pt-2 px-2">
                <div class="flex flex-row w-full justify-between">
                    <span class="text-lg font:medium">Total Amount</span>
                    <span class="text-blue-700 font:medium text-lg">Rs. {{totalAmount}}</span>
                </div>
                <button class="bg-blue-600 w-full py-2 mt-4 rounded-md text-white font-medium
                            hover:bg-blue-700"
                >Checkout</button>
            </div>

        </aside>
    </div>
</template>

