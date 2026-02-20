import { ref } from 'vue'
import type { cartDataType } from '@/shared/types/cart'
import { useToast } from '#imports'


export function useCart() {

    const cart = useState<cartDataType[]>('cart:items', ()=>[]);
    const cartTotal = useState<number>('cart:total', ()=>0);
    const loading = useLoadingScreen(); //using global loader
    const error = useState<string | null>('cart:error', ()=>null);
    const toast = useToast();

    type apiResponse<T>={success: true; message: T} | {success: false, message: string}

    async function fetchCart() {
        loading.value = true
        error.value = null

        try {
            const res = await $fetch<apiResponse<cartDataType[]>>('/api/user/cart',{
                cache: 'no-cache'
            })

            if (!res.success) {
                error.value = res.message
                toast.error({title: 'ERROR', message: error.value});
                return
            }
            cart.value = res.message

            } catch (err) {
                error.value = (err as Error).message
                toast.error({title: 'ERROR', message:'Unexpected Error Occured'});
            } finally {
                loading.value = false
            }
        }

    async function addToCart(menuId: number, quantity:number) {
        loading.value = true
        error.value = null
        try{
            const res = await $fetch<{success: boolean, message:cartDataType[]}>('/api/user/cart', {
                method: 'POST',
                body: { menuId, quantity }
            })
            if(res.success){
                toast.success({title: 'SUCCESS', message: 'Item Added to Cart'});
                await fetchCart();
                return
            }
        }catch(err:any){

            const status = err?.statusCode;
            error.value=err?.data?.message;
            
            if(status === 400){
                toast.error({message: 'Validation Error'});
            }else{
                toast.error({message: 'Unexpected Error Occured'});
            }
        }finally{
            loading.value = false
        }
    }

    async function removeFromCart(cartId: number) {
        loading.value = true
        error.value = null
        try {
            const res = await $fetch<{success: boolean, message:cartDataType[]}>('/api/user/cart', {
                method: 'DELETE',
                body: { cartId }
            })

            if (res.success) {
                await fetchCart()
                toast.success({title: 'SUCCESS', message: 'Item Removed From Cart'});
                return
            }
        } catch (err: any) {
            
            const status = err?.statusCode;
            error.value=err?.data?.message;

            if(status === 400){
                toast.error({message: 'No Cart Id'});
            }if(status === 404){
                toast.error({message: 'Item does not exist in cart'});
            }else{
                toast.error({message: 'Unexpected Error Occured'});
            }
        }finally{
            loading.value = false
        }
    }

    async function updateCart(cartId: number, quantity: number) {
        loading.value = true
        error.value = null
        try {
            const res = await $fetch<apiResponse<cartDataType[]>>('/api/user/cart', {
                method: 'PATCH',
                body: { cartId, quantity }
            })

            if (res.success) {
                await fetchCart()
                return
            }
    
        } catch (err: any) {
            const status = err?.statusCode;
            error.value=err?.data?.message;
            
            if(status === 400){
                toast.error({message: 'Invalid Body'});
            }if(status === 404){
                toast.error({message: 'Cart item already deleted'});
            }else{
                toast.error({message: 'Unexpected Error Occured'});
            }
        }finally{
            loading.value = false
        }
    }

    watch(cart,(newCart) => {
            cartTotal.value = newCart.reduce((sum, item) => sum + item.price * item.quantity,0)
        },
        { deep: true, immediate: true }
    )
        
    return {
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCart,
        cartTotal
    }

}
