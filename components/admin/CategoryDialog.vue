<script setup lang="ts">

    import { useToast } from '#imports';
    import {z} from 'zod'
    const toast = useToast();

    interface apiResponse{
        success: boolean, 
        message: {
            id: number,
            name: string
        }[] | string

    }

    interface deleteApiResponse{
    success: boolean, 
    message: {
        id: number,
        name: string
    } | string

    }

    const props = defineProps<{
    isOpen: boolean
    onClose?: () => void
    }>()

    const newCategory = ref<string>('')

//-------------------API CALL-------------------------//

    //API call to fetch all categories

    const categories = ref<Array<{id: number, name: string}>>([]); 
    const {data, error} = await useFetch<apiResponse>('/api/shared/categories', {
        method: 'GET'
    })

    if(error.value){
        categories.value=[];
        console.error('SERVER ERROR');
        toast.error({title: 'SERVER ERROR', message:error.value.data.message});
    }
    else{
        if(data.value?.success && typeof(data.value.message) !== 'string'){
            categories.value=data.value.message;
            toast.success({title: 'Success', message:`Categories fetched successfully`});
        }else{
            toast.error({title: 'ERROR', message:data.value?.message as string});
        }
    }

    //api call to add categories
    const handleAdd = async() =>{
        const schema = z.string();
        schema.safeParse(newCategory);
        if(!schema){
            toast.error({title: 'ERROR', message: 'The category must be a string'});
        }
        const {data, error} = await useFetch<apiResponse>('/api/admin/categories', 
        {
            method: 'POST',
            body: {
                category: newCategory
            }
        })

        if(error.value){
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }
        else{
            if(data.value?.success && typeof(data.value.message) !== 'string'){
                categories.value=[...categories.value, ...data.value.message]
                toast.success({title: 'Success', message:`Category added successfully`});
            }else{
                toast.error({title: 'ERROR', message:data.value?.message as string});
            }
        }
    }

    //api call to delete categories
    const handleDelete = async(key: number)=>{
        const {data, error} = await useFetch<deleteApiResponse>(`/api/admin/categories/${key}`, 
        {
            method: 'DELETE',
        })

        if(error.value){
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }
        else{
            if(data.value?.success && typeof(data.value.message) !== 'string'){
                const deletedId = data.value.message.id
                categories.value = categories.value.filter(
                    category => category.id !== deletedId
                )
                toast.success({title: 'Success', message:`Category removed successfully`});
            }else{
                toast.error({title: 'ERROR', message:data.value?.message as string});
            }
        }
    }

    //----------------------------------------------------//
</script>

<template>
  <teleport to="body">
    <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        
        <!-- Title -->
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Manage Categories
        </h2>

        <!-- Add Category Row -->
        <form class="flex gap-3 mb-5" @submit.prevent="handleAdd">
          <input v-model="newCategory" type="text" placeholder="Enter category name"
            class="flex-1 h-11 px-4 border rounded-md
            focus:border-blue-500 focus:outline-none"
          />

          <button type="submit" class="px-5 py-2 bg-blue-600 text-white rounded-md
             hover:bg-blue-700 transition">Add
          </button>
        </form>

        <!-- Categories List -->
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div v-for="category in categories" :key="category.id"
            class="flex items-center justify-between px-4 py-2 border rounded-md
            hover:bg-gray-50 transition">

            <span class="text-gray-800">{{ category.name }}</span>

            <button class="flex items-center gap-1 px-3 py-1.5 text-sm
            bg-red-500 text-white rounded-md
            hover:bg-red-600 transition" @click="()=>handleDelete(category.id)">
              <span class="material-symbols-outlined text-base">delete</span>
              Delete
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-5">
          <button type="button" @click="onClose"
            class="px-4 py-2 border rounded-md hover:bg-gray-100 transition">Close
          </button>
        </div>

      </div>
    </div>
  </teleport>
</template>