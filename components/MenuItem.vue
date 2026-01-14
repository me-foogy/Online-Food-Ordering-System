<script setup lang="ts">
    defineProps<{
        item: {
            id: number
            name: string
            category: string
            price: number
            description: string
            image: string
            inStock: boolean
        }
    }>()
    const inStock = ref(true)
    
</script>

<template>
    <div class="w-full bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
        <!--Menu Image-->
        <img
            :src="item.image"
            alt="Food item"
            class="w-full h-44 object-cover"
        />

        <div class="p-6 flex flex-col h-full flex-1">
            <!--Name and Price-->
            <div>
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">{{item.name}}</h3>
                    <span class="text-blue-600 font-semibold">Rs. {{item.price}}</span>
                </div>
                <!--Description-->
                <p class="text-sm text-gray-600 line-clamp-2">{{item.description}}</p>
            </div>

            <!--Toggle + edit btn -->
            <div class="flex items-center justify-between pt-3 mt-auto">
                <div class="flex items-center gap-2">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <!-- Hidden Checkbox -->
                        <input type="checkbox" v-model="inStock" class="sr-only" />
                        <!-- Toggle Track -->
                        <div
                            class="w-10 h-5 rounded-full transition-colors duration-300"
                            :class="{'bg-blue-600': inStock,  'bg-gray-300':!inStock}"
                        ></div>
                        <!-- Toggle Thumb -->
                        <div
                            class="absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform duration-300"
                            :class="{'translate-x-5': inStock, 'translate-x-1': !inStock}"
                        ></div>
                    </label>
                    <span class="text-sm text-gray-700">In Stock</span>
                </div>


                <button class="flex items-center gap-1 px-3 py-1.5 border rounded-md text-sm text-gray-700 hover:bg-gray-100 transition">
                    <span class="material-symbols-outlined text-base">edit</span>
                    Edit
                </button>
            </div>
        </div>
    </div>
</template>

