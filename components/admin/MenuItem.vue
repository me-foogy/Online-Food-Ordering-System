<script setup lang="ts">

    import { useToast } from '#imports';
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

    interface toggleMenuResponse{
        success: boolean,
        message: menuType[] | string
    }

    const props = defineProps<{
        item: menuType
    }>()

    const inStock = ref(props.item.inStock);

    const toggleStock = async() =>{
        inStock.value=!inStock.value;
        try{
            const {data, error} = await useFetch<toggleMenuResponse>('/api/admin/menu/stock', {
                method: 'POST',
                body: {
                    ...props.item,
                    inStock: inStock.value
                }
            })
                
            if(error.value){
                console.error('SERVER ERROR');
                toast.error({title: 'SERVER ERROR', message:error.value.data.message});
                return
            }

            if(data.value?.success && typeof(data.value.message) !== 'string'){
                
                const name = data.value.message[0]?.name;
                const inStock = data.value.message[0]?.inStock;
                toast.success({title: 'Success', message:`${name} stock toggled to ${inStock}`});

            }else{
                toast.error({title: 'ERROR', message:data.value?.message as string});
            }    
        }
        
        catch(err){
                toast.error({title: 'ERROR', message:'Unexpected error occured'});
        }
    }

    const emit = defineEmits<{
        (e: 'edit', item:menuType): void
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

        <div class="p-6 flex flex-col h-full flex-1">
            <!--Name and Price-->
            <div>
                <div class="flex justify-between items-center">
                    <h3 class="text-base md:text-xl font-semibold text-gray-800">{{item.name}}</h3>
                    <span class="text-base md:text-xl text-blue-600 font-semibold">Rs. {{item.price}}</span>
                </div>
                <!--Description-->
                <p class="text-xs md:text-sm text-gray-600 line-clamp-2">{{item.description}}</p>
            </div>

            <!--Toggle + edit btn -->
            <div class="flex items-center justify-between pt-3 mt-auto">
                <div class="flex items-center gap-2">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <!-- Hidden Checkbox -->
                        <input type="checkbox" class="sr-only" @click="toggleStock"/>
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


                <button class="flex items-center gap-1 px-3 py-1.5 border rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
                @click="emit('edit', item)">
                    <span class="material-symbols-outlined text-base">edit</span>
                    Edit
                </button>
            </div>
        </div>
    </div>
</template>

