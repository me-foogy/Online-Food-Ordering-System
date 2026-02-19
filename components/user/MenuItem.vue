<script setup lang="ts">

    const {addToCart} = useCart();

    interface menuType {
        id: number
        name: string,
        category: string,
        price: number,
        description: string
        image: string
        inStock: boolean
    }

    const props = defineProps<{
        item: menuType
    }>()

</script>

<template>

    <div class="w-full bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
        <!--Menu Image-->
        <img
            :src="item.image"
            alt="Food item"
            class="w-full h-44 object-cover"
        />

        <div class="p-3 lg:p-6 flex flex-col h-full flex-1">
            <!--Name and Price-->
            <div class="space-y-1">
                <div class="flex justify-between items-center">
                    <h3 class="text-base lg:text-lg font-semibold text-gray-800">{{item.name}}</h3>
                    <span class="text-sm lg:text-base text-blue-600 font-semibold">Rs. {{item.price}}</span>
                </div>
                <!--Description-->
                <p class="text-xs md:text-sm text-gray-600 line-clamp-2">{{item.description}}</p>
            </div>

            <div class="flex items-center justify-end pt-3 mt-auto">
                <!-- <button class="material-symbols-outlined">favorite</button> -->

                <button class="flex items-center gap-1 px-3 py-1 lg:py-1.5 border rounded-md text-xs lg:text-sm text-gray-700 "
                    :class="item.inStock?'hover:bg-gray-100 transition':'bg-red-500 text-white'"
                    :disabled="!item.inStock"
                    @click="addToCart(item.id, 1)"> 
                    <!-- 1 sent as initial quantity -->

                    <span class="material-symbols-outlined text-base">{{item.inStock?'add':'block'}}</span>
                    {{item.inStock?'Add to Cart':'Out of Stock'}}
                    
                </button>

            </div>
        </div>
    </div>
</template>

