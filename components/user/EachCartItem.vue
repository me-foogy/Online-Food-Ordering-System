<script setup lang="ts">

    import { useCartStore } from '@/stores/cart'
    const cart = useCartStore();

    interface cartDataType {
        id: number,
        name: string,
        category: string,
        price: number,
        image: string,
        quantity: number
    }

    const props = defineProps<{
        item: cartDataType
    }>();

    const increaseQuantity = () => {
        cart.updateQuantity({ id: props.item.id, quantity: props.item.quantity + 1 });
    }

    const decreaseQuantity = () => {
        if (props.item.quantity > 1) {
            cart.updateQuantity({ id: props.item.id, quantity: props.item.quantity - 1 });
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
                @click="cart.removeFromCart(item.id)">
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

                <div class="flex items-center gap-1">

                    <button class="material-symbols-outlined text-gray-400 hover:text-blue-600 cursor-pointer transition"
                    @click="decreaseQuantity">remove_circle </button>

                    <span class="font-medium text-blue-600 min-w-[20px] text-center">{{item.quantity}}</span>

                    <button class="material-symbols-outlined text-gray-400 hover:text-blue-600 cursor-pointer transition"
                    @click="increaseQuantity">add_circle</button>

                </div>
            </div>
        </div>
     </div>
</template>