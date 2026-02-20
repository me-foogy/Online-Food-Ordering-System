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
        }[]
    }

    interface deleteApiResponse{
        success: boolean, 
        message: {
            id: number,
            name: string
        }
    }

    async function fetchCategory(){

        const {data, error} = await useFetch<apiResponse>('/api/shared/categories', {
            method: 'GET',
            cache: 'no-cache',
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
            toast.error({title: 'SERVER ERROR', message:'Unexpexted Error Occured'});
            return
        }

        if(data.value?.success){
            category.value=data.value.message;
            toast.success({title: 'Success', message:`Categories fetched successfully`});
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
            toast.error({title: 'SERVER ERROR', message:'Unexpected Error Occured'});
            return
        }

        if(data.value?.success){
            fetchCategory();
            toast.success({title: 'Success', message:`Category Added Successfully`});
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
            const status = error.value.statusCode;

            if(status===404){
                toast.error({title: 'SERVER ERROR', message:'The category is already deleted'});  
            }else{
                toast.error({title: 'SERVER ERROR', message:'Unexpected Error Occured'});  
            }

            return
        }

        if(data.value?.success){
            fetchCategory();
            toast.success({title: 'Success', message:`Category Deleted Successfully`});
        }
    }

    
    return {
        category,
        fetchCategory,
        addCategory,
        deleteCategory
    }
}