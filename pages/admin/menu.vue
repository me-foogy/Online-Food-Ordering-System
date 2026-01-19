<script setup lang="ts">
    import {ref} from 'vue';

    import { menuData } from './menudata';
    import MenuItem from '@/components/admin/MenuItem.vue'
    import FoodDialog from '@/components/admin/FoodDialog.vue'

    interface menuType {
        id?: number
        name?: string,
        category?: string,
        price?: number,
        description?: string
        image?: string
        inStock?: boolean
    }
    
    const searchBarInput = ref<string>('');
    const selectedItem = ref<menuType|null>(null);
    const foodOptions:string[] = ['All', 'Breakfast', 'Fast Food', 'Sea Food', 'Dinner', 'Dessert', 'Drinks'];
    const activeType = ref('All');

    const filteredMenuData = computed(()=>{
        if(activeType.value==='All') return menuData.filter(item=>item.name.toLowerCase().includes(searchBarInput.value.toLowerCase()));
        return menuData.filter(item=> item.category===activeType.value && item.name.toLowerCase().includes(searchBarInput.value.toLowerCase()));
    })

    const showDialog = ref(false);
    const date = new Date();
    const formatedDate = `${date.getFullYear()} - ${date.getMonth()+1} - ${date.getDate()}`;
    
    function openDialog(item: menuType){
        selectedItem.value=item;
        showDialog.value=true;
    }

    definePageMeta({
        layout: 'admin' 
    })
</script>

<template>
    <!--The Top search Section-->
    <div class="bg-white border rounded-xl p-4 flex flex-col flex-wrap md:items-center gap-2 md:gap-4 md:flex-row">

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

        <!-- Center: Search -->
        <div class="flex md:justify-center flex-1 min-w-0">
            <form class="flex w-full max-w-md gap-2 flex-1 min-w-0">
                <input type="text" placeholder="Search food" v-model="searchBarInput"
                class="flex-1 h-11 w-full px-4 border border-gray-300 rounded-md text-sm sm:text-sm md:text-base text-gray-800 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                hover:border-blue-400 transition min-w-0"/>
                <!-- <button type="submit"
                    class="h-11 px-4 bg-blue-600 text-white rounded-md 
                    hover:bg-blue-700 hover:translate-y-[1px] transition flex-shrink-0">
                    <span class="material-symbols-outlined text-xl">search</span>
                </button> -->
            </form>
        </div>

        <!-- Right: Add Item -->
        <div class="flex-shrink-0">
            <button
            class="flex items-center gap-2 h-11 px-5 bg-blue-600 text-white rounded-md font-medium whitespace-nowrap
            hover:bg-blue-700 transition"
             @click="showDialog = true">
                <span class="material-symbols-outlined text-base sm:text-xl md:text-xl">add</span>
                <span class="text-sm sm:text-base md:text-lg truncate">Add Item</span>
            </button>
        </div>
    </div>

    <FoodDialog v-if="showDialog" :isOpen="showDialog" :onClose="()=>{showDialog=false; selectedItem=null}" :menuInfo="selectedItem"></FoodDialog>



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
    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 overflow-y-auto">
        <MenuItem v-for="item in filteredMenuData" :key="item.id" :item="item" @edit="openDialog"/>
    </div>
</template>