<script setup lang="ts">

    import { useToast } from '#imports';
    const toast = useToast();

    interface menuType {
        id?: number
        name?: string,
        category?: string,
        price?: number,
        description?: string
        image?: string
        inStock?: boolean
    }

    interface AddMenuResponse{
        success: boolean
        message: Required<menuType>[] | string
    }

    interface apiResponse{
        success: boolean, 
        message: {
            id: number,
            name: string
        }[] | string

    }

    const props = defineProps<{
    isOpen: boolean
    dialogAction: 'Add'|'Edit'
    onClose: () => void
    menuInfo?: menuType | null
    }>()

    console.log(props.menuInfo)
    const form = reactive({
    name: '',
    category: '',
    price: undefined as number | undefined,
    description: '',
    image: '',
    })

    watch(
        () => props.menuInfo,
        (item) => {
            if (!item) {
                form.name = ''
                form.category = ''
                form.price = undefined
                form.description = ''
                form.image = ''
                return
            }
        form.name = item.name ?? ''
        form.category = item.category ?? ''
        form.price = item.price
        form.description = item.description ?? ''
        form.image = item.image ?? ''
    },
    { immediate: true }
    )

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

    const handleSubmit = async () =>{
        if (props.dialogAction==='Add'||'Edit'){
           //handle Add Action to api
           try{
                const {data, error} = await useFetch<AddMenuResponse>(`/api/admin/menu/${props.dialogAction.toLowerCase()}`, {
                    method: 'POST',
                    body: (props.dialogAction=='Add')?{...form}:{...form, id: props.menuInfo?.id}
                })
                
                if(error.value){
                console.error('SERVER ERROR');
                toast.error({title: 'SERVER ERROR', message:error.value.data.message});
                return
                }

                if(data.value?.success && typeof(data.value.message) !== 'string'){
                    
                    const name = data.value.message[0]?.name;
                    //api always returns at least one object in the array but the if is assurance for ts
                    if(name) toast.success({title: 'Success', message:`${name} ${props.dialogAction.toLowerCase()}ed successfully`});

                }else{
                    toast.error({title: 'ERROR', message:data.value?.message as string});
                }
            
            }
            catch(err){
                toast.error({title: 'ERROR', message:'Unexpected error occured'});
            }
        }
        props.onClose();
    }

</script>

<template>
    <teleport to="body">
        <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">
                    {{dialogAction}} Menu Item
                </h2>

                <form class="space-y-4" @submit.prevent="handleSubmit">
                    <!-- Name -->
                    <input v-model="form.name" type="text" placeholder="Item name" maxlength="40"
                        class="w-full h-11 px-4 border rounded-md focus:border-blue-500 focus:outline-none"
                        required
                    />

                    <!-- Category -->
                    <select v-model="form.category"
                        class="w-full h-11 px-4 border border-gray-300 rounded-md bg-white text-gray-800
                            focus:outline-none focus:border-blue-500
                            transition"
                        required>

                        <option value="" disabled>Select Category</option>
                         <option v-for="category in categories" :key="category.id" :value="category.name">
                            {{ category.name }}
                        </option>
                    </select>

                    <!-- Price -->
                    <input v-model="form.price" type="number" placeholder="Price"
                        class="w-full h-11 px-4 border rounded-md 
                        focus:border-blue-500 focus:outline-none"
                        required
                    />

                    <!-- Image URL -->
                    <input v-model="form.image" type="url" placeholder="Image URL"
                        class="w-full h-11 px-4 border rounded-md
                        focus:border-blue-500 focus:outline-none"
                        required
                    />

                    <!-- Description -->
                    <textarea v-model="form.description" placeholder="Description" maxlength="200" rows="3"
                        class="w-full px-4 py-2 border rounded-md focus:border-blue-500 focus:outline-none"
                    />

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-4">
                        <button type="button" @click="onClose" class="px-4 py-2 border rounded-md">Cancel</button>
                        <button type="submit"
                                class="px-5 py-2 bg-blue-600 text-white rounded-md 
                                hover:bg-blue-700"> Save Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </teleport>
</template>
