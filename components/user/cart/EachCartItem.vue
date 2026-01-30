<script setup lang="ts">

    import { useCartStore } from '@/stores/cart';
    import type { cartDataType } from '@/shared/types/cart';
    const {cart, updateCart, loading, error, fetchCart, addToCart, removeFromCart, cartTotal} = useCart()

    const props = defineProps<{
        item: cartDataType
    }>();

    const increaseQuantity = () => {
        updateCart(props.item.id, props.item.quantity+1);
    }

    const decreaseQuantity = () => {
        if (props.item.quantity > 1) {
            updateCart(props.item.id, props.item.quantity-1);
        }
    }

</script>

<template>

    <div class="w-full bg-white border rounded-xl p-3 flex gap-3 shadow-md transition">
        <!-- Image -->
        <img
        :src="item.image"
        alt="Food item"
        class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />

        <!-- Content -->
        <div class="flex-1 flex flex-col justify-between">
            <!-- Name and Delete -->
            <div class="flex justify-between items-start">
                <h2 class="font-semibold text-gray-800 truncate">
                    {{ item.name }}
                </h2>
                <span class="material-symbols-outlined text-gray-400 hover:text-red-500 cursor-pointer transition"
                @click="removeFromCart(item.id)">
                    delete
                </span>
            </div>

            <span class="text-sm text-gray-500">
                {{ item.category }}
            </span>

            <div class="flex justify-between items-center">

                <h2 class="font-semibold text-blue-600">
                    Rs. {{ item.price }}
                </h2>

                <div class="flex items-center gap-1" v-if="item.inStock">
                    <button class="material-symbols-outlined text-gray-400 hover:text-blue-600 cursor-pointer transition"
                    @click="decreaseQuantity">remove_circle </button>

                    <span class="font-medium text-blue-600 min-w-[20px] text-center">{{item.quantity}}</span>

                    <button class="material-symbols-outlined text-gray-400 hover:text-blue-600 cursor-pointer transition"
                    @click="increaseQuantity">add_circle</button>
                </div>
                
                <div v-else>
                    <span class="text-sm bg-red-500 text-white py-1 px-2 rounded-md">Out Of Stock</span>
                </div>

            </div>
        </div>
     </div>
</template>