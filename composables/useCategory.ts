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

    function fetchCategory(){

        const {data, error, pending} = useFetch<apiResponse>('/api/shared/categories', {
            method: 'GET',
            
        })

        watch (pending, (isPending)=>{
            pending.value = isPending;
        }, {immediate: true})

        watch (data, (newData)=>{
            if(newData?.success && typeof(newData.message) !== 'string'){
                category.value=newData.message;
                toast.success({title: 'Success', message:`Categories fetched successfully`});
            }else{
                toast.error({title: 'ERROR', message:newData?.message as string});
            }
        })

        watch(error, (err)=>{
            if(err){
                category.value=[];
                console.error('SERVER ERROR');
                toast.error({title: 'SERVER ERROR', message:err.data.message});
            }
        })
    }

    //api call to add category
    const addCategory = async(newCategory:string) =>{
        const schema = z.string();
        schema.safeParse(newCategory);
        if(!schema){
            toast.error({title: 'ERROR', message: 'The category must be a string'});
        }

        const {data, error, pending} = useFetch<apiResponse>('/api/admin/categories', 
        {
            method: 'POST',
            body: {
                category: newCategory
            }
        })

        watch(pending, (isPending)=>{
            loading.value=isPending
        }, {immediate: true})

        watch(data, (newData)=>{
            if(newData?.success && typeof(newData.message) !== 'string'){
                fetchCategory();
                toast.success({title: 'Success', message:`Category added successfully`});
            }else{
                toast.error({title: 'ERROR', message:newData?.message as string});
            }
        })

        watch(error, (err)=>{
            if(err){
                console.error('SERVER ERROR');
                toast.error({title: 'SERVER ERROR', message:err.data.message});
            }
        })
    }

    //api call to delete categories
    const deleteCategory = async(key: number)=>{
        const {data, error, pending} = useFetch<deleteApiResponse>(`/api/admin/categories/${key}`, 
        {
            method: 'DELETE',
        })

        watch(pending, (isPending)=>{
            loading.value=isPending
        }, {immediate: true})

        watch(data, (newData)=>{
            if(newData?.success && typeof(newData.message) !== 'string'){
                fetchCategory();
                toast.success({title: 'Success', message:`Category removed successfully`});
            }else{
                toast.error({title: 'ERROR', message:newData?.message as string});
            }
        })

        watch(error, (err)=>{
            if(err){
                console.error('SERVER ERROR');
                toast.error({title: 'SERVER ERROR', message:err.data.message});
            }
        })
    }

    
    return {
        category,
        fetchCategory,
        addCategory,
        deleteCategory
    }
}