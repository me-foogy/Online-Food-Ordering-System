<script lang="ts" setup>
    import EachCartItem from '@/components/user/cart/EachCartItem.vue';
    import { useCartStore } from '@/stores/cart';
    import { useToast } from '#imports';
    import CheckoutDialog from './checkoutDialog.vue';
    const {cart, fetchCart, cartTotal} = useCart();
    const toast = useToast();
    const showCart = ref<boolean>(false);
    const showConfirmation = ref<boolean>(false); 
    const {receivingOrders, fetchReceivingOrders} = useReceivingOrders();

    onMounted(fetchCart);

    const toggleCart = () =>{
        showCart.value = !showCart.value;
    }

    const handleCheckout = async()=>{
        //check if restaurant is receiving orders
        await fetchReceivingOrders();
        if(receivingOrders.value===false){
            toast.error({message: 'Restaurant is Closed at the moment'});
            return
        }

        //check if cart items are out of stock
        fetchCart();
        if(cart.value.some(item=>item.inStock===false)){
            toast.error({message: 'Cart contains items not in stock'});
            return
        }
        if(cart.value.length===0){
            toast.error({message: 'Cart is Empty'});
            return
        }
        showConfirmation.value=true;
    }
</script>

<template>
    <button
        :class="['fixed right-4 top-4 text-sm md:text-base text-white px-4 py-2 rounded-full shadow-lg z-50 xl:hidden flex flex-row justify-center',
            showCart? 'bg-red-600':'bg-blue-600'
        ]"
        @click="toggleCart">
        <span class="text-sm md:text-base material-symbols-outlined text-white mr-2">{{showCart?'close':'shopping_cart'}}</span>
        {{ cart.length }}
    </button>
    
    <!--Each Cart Item-->
    <aside :class="[
        'w-[20rem] lg:w-96 bg-white border-l border-gray-200 p-4 fixed top-0 right-0 h-[100dvh] transition-transform duration-300',
        showCart? 'translate-x-0' : 'translate-x-full',
        'xl:translate-x-0 flex flex-col justify-between'
        ]">

        <div class="flex-1 max-h-[90%] overflow-y-auto">
            <h2 class="text-lg font-semibold mb-4 pl-4">My Order</h2>
            <div class=" space-y-2" v-if="cart.length!==0">
                <EachCartItem v-for="item in cart" :key="item.id" :item="item"/>
            </div>
            <div v-else class="flex flex-col items-center justify-center text-center gap-2 py-20">
            <p class="text-red-600 text-lg font-semibold">No Items in Cart</p>
            <p class="text-red-600 text-sm">Added Menu Items Appear Here</p>
            </div>
        </div>

        <div class="border-t pt-2 px-2">
            <div class="flex flex-row w-full justify-between">
                <span class="text-lg font:medium">Total Amount</span>
                <span class="text-blue-700 font:medium text-lg">Rs. {{cartTotal}}</span>
            </div>
            <button class="bg-blue-600 w-full py-2 mt-4 rounded-md text-white font-medium
                        hover:bg-blue-700" @click="handleCheckout"
            >Checkout</button>
        </div>
        <CheckoutDialog :isOpen="showConfirmation" :onClose="()=>{showConfirmation=false}"/>
    </aside>
</template>