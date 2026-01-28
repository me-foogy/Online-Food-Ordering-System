<script setup lang="ts">
    import {ref} from 'vue';
    import MenuItem from '@/components/admin/MenuItem.vue'
    import FoodDialog from '@/components/admin/FoodDialog.vue'
    import { useToast } from '#imports';
    import CategoryDialog from '~/components/admin/CategoryDialog.vue';
    const toast = useToast();

    interface menuType {
        id: number
        name: string,
        category: string,
        price: number,
        description: string
        image: string
        inStock: boolean
    }

    interface menuResponse{
        success: boolean
        message: Required<menuType>[] | string
    }

    const searchBarInput = ref<string>('');
    const selectedItem = ref<menuType|null>(null);
    const foodOptions = ref<string[]>(['All']);
    const activeType = ref('All');
    const showDialog = ref(false);
    const showCategoryDialog = ref(false);
    const dialogAction = ref<'Add'|'Edit'>('Add');
    const date = new Date();
    const formatedDate = `${date.getFullYear()} - ${date.getMonth()+1} - ${date.getDate()}`;
    const menuData = ref<menuType[]>([]);

    //----------------Category fetch API call-------------------//
    {
        const {data, error} = await useFetch<menuResponse>('/api/shared/categories', {
            method: 'GET'
        })

        if(error.value){
            foodOptions.value=['All'];
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }
        else{
            if(data.value?.success && typeof(data.value.message) !== 'string'){
                const names = data.value.message.map(category=>category.name);
                foodOptions.value=['All', ...names];
                toast.success({title: 'Success', message:`Categories fetched successfully`});
            }else{
                foodOptions.value=['All'];
                toast.error({title: 'ERROR', message:data.value?.message as string});
            }
        }
    }
    //---------------------------------------------------------//

    //----------------API CALL----------------//
    {
        const {data, error} = await useFetch<menuResponse>('/api/shared/menu/all')

        if(error.value){
            menuData.value=[];
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }
        else{
            if(data.value?.success && typeof(data.value.message) !== 'string'){
                menuData.value=data.value.message
                toast.success({title: 'Success', message:`Menu Items fetched successfully`});
            }else{
                menuData.value=[];
                toast.error({title: 'ERROR', message:data.value?.message as string});
            }
        }
    }

    //--------------------------------------------//

    const filteredMenuData = computed(()=>{    
            if(activeType.value==='All') return menuData.value.filter(item=>item.name.toLowerCase().includes(searchBarInput.value.toLowerCase()));
            return menuData.value.filter(item=> item.category===activeType.value && item.name.toLowerCase().includes(searchBarInput.value.toLowerCase()));
    })
    
    function openDialog(item: menuType | null){
        selectedItem.value=item;
        dialogAction.value='Edit'
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
        <div class="flex-shrink-0 flex flex-row space-x-2">

            <button
            class="flex items-center gap-2 h-11 px-5 bg-blue-600 text-white rounded-md font-medium whitespace-nowrap
            hover:bg-blue-700 transition"
             @click="dialogAction='Add'; showDialog = true">
                <span class="material-symbols-outlined text-base sm:text-md md:text-md">add</span>
                <span class="text-sm sm:text-base md:text-sm truncate">Add Item</span>
            </button>
        </div>
    </div>

    <FoodDialog v-if="showDialog" :isOpen="showDialog" :dialogAction="dialogAction" :menuInfo="selectedItem" :onClose="()=>{showDialog=false; selectedItem=null}" ></FoodDialog>
    <CategoryDialog v-if="showCategoryDialog" :isOpen="showCategoryDialog" :onClose="()=>{showCategoryDialog=false;}" ></CategoryDialog>



    <!--The Filter By Category Section-->
    <div class="space-y-4 mt-6">

        <div class="flex flex-row justify-between items-center my-6">
            <h2 class="text-xl font-semibold text-gray-800">Manage Your Menu Items</h2>
            <button
            class="flex items-center gap-2 h-11 px-5 rounded-md font-medium whitespace-nowrap border bg-white
            text-blue-600 hover:bg-gray-100  hover:border-blue-600 transition"
            @click="showCategoryDialog = true">
                <span class="material-symbols-outlined text-base sm:text-md md:text-md">edit</span>
                <span class="text-sm sm:text-base md:text-sm truncate">Edit Categories</span>
            </button>
        </div>

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