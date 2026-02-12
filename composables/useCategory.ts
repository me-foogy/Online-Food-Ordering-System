import { useToast } from '#imports';
import {z} from 'zod'

export function useCategory(){

    const category = useState<{id: number, name: string}[]>('category:items', ()=>[]);
    const toast = useToast();
    const loading = useLoadingScreen();

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

    async function fetchCategory(){

        const {data, error} = await useFetch<apiResponse>('/api/shared/categories', {
            method: 'GET',
            onRequest(){
                loading.value = true
            },
            onResponse(){
                loading.value=false
            },
            onResponseError(){
                loading.value=false
            }
        })

        if(error.value){
            category.value=[];
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }

        if(data.value?.success && typeof(data.value.message) !== 'string'){
            category.value=data.value.message;
            toast.success({title: 'Success', message:`Categories fetched successfully`});
        }else{
            toast.error({title: 'ERROR', message:data.value?.message as string});
        }
    }

    //api call to add category
    const addCategory = async(newCategory:string) =>{
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
            },
            onRequest(){
                loading.value = true
            },
            onResponse(){
                loading.value=false
            },
            onResponseError(){
                loading.value=false
            }
        })

        if(error.value){
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }

        if(data.value?.success && typeof(data.value.message) !== 'string'){
            category.value.push(data.value.message[0]!);
            toast.success({title: 'Success', message:`Category Added Successfully`});
        }else{
            toast.error({title: 'ERROR', message:data.value?.message as string});
        }
    }

    //api call to delete categories
    const deleteCategory = async(key: number)=>{
        const {data, error} = await useFetch<deleteApiResponse>(`/api/admin/categories/${key}`, 
        {
            method: 'DELETE',
            onRequest(){
                loading.value = true
            },
            onResponse(){
                loading.value=false
            },
            onResponseError(){
                loading.value=false
            }
        })

        if(error.value){
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }

        if(data.value?.success && typeof(data.value.message) !== 'string'){
            category.value = category.value.filter(eachCategory => eachCategory.id != key)
            toast.success({title: 'Success', message:`Category Deleted Successfully`});
        }else{
            toast.error({title: 'ERROR', message:data.value?.message as string});
        }
    }

    
    return {
        category,
        fetchCategory,
        addCategory,
        deleteCategory
    }
}