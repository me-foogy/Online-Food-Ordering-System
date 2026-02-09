import { ref } from 'vue'
import type { cartDataType } from '@/shared/types/cart'
import { useToast } from '#imports'


export function useCart() {

    const cart = useState<cartDataType[]>('cart:items', ()=>[]);
    const cartTotal = useState<number>('cart:total', ()=>0);
    const loading = useState<boolean>('cart:loading', ()=>false);
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
                toast.error({title: 'ERROR', message: error.value});
            } finally {
                loading.value = false
            }
        }

    async function addToCart(menuId: number, quantity:number) {
        try{
            const res = await $fetch<apiResponse<cartDataType[]>>('/api/user/cart', {
                method: 'POST',
                body: { menuId, quantity }
            })
            if(!res.success){
                error.value = res.message
                toast.error({title: 'ERROR', message: error.value});
                return
            }
            toast.success({title: 'SUCCESS', message: 'Item Added to Cart'});
            await fetchCart();
        } catch(err){
            error.value=(err as Error).message
            toast.error({title: 'ERROR', message: error.value});
        }
    }

    async function removeFromCart(cartId: number) {
        try {
            const res = await $fetch<apiResponse<cartDataType[]>>('/api/user/cart', {
                method: 'DELETE',
                body: { cartId }
            })

            if (!res.success) {
                error.value=res.message
                toast.error({title: 'ERROR', message: error.value});
                return
            }

        toast.success({title: 'SUCCESS', message: 'Item Removed From Cart'});
        await fetchCart()
        } catch (err) {
            error.value = (err as Error).message
            toast.error({title: 'ERROR', message: error.value});
        }
    }

    async function updateCart(cartId: number, quantity: number) {
        try {
            const res = await $fetch<apiResponse<cartDataType[]>>('/api/user/cart', {
                method: 'PATCH',
                body: { cartId, quantity }
            })

            if (!res.success) {
                error.value=res.message
                 toast.error({title: 'ERROR', message: error.value});
                return
            }
        
        await fetchCart()
        } catch (err) {
            error.value = (err as Error).message
             toast.error({title: 'ERROR', message: error.value});
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
