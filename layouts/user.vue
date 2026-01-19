<template>
    <div class="min-h-screen flex bg-gray-100">
      <!-- Sidebar -->
      <aside class="bg-white border-r border-gray-200 w-14 lg:w-64 fixed top-0 left-0 h-screen flex flex-col">
        <div class="h-full flex flex-col">

              <!-- Navigation -->
              <nav class="flex-1 px-2 py-4 space-y-1">
                  <NuxtLink to="/user/home" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      home
                      </span>
                      <span class="label">Home</span>
                  </NuxtLink>
                  <NuxtLink to="/user/favourite" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      favorite
                      </span>
                      <span class="label">Favourites</span>
                  </NuxtLink>
                  <NuxtLink to="/user/history" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      history
                      </span>
                      <span class="label">Order History</span>
                  </NuxtLink>
                  <NuxtLink to="/user/reviews" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      star
                      </span>
                      <span class="label">Reviwes</span>
                  </NuxtLink>
              </nav>
              <!-- Logout -->
              <div class="p-4 border-t">
                <NuxtLink to="/user/account" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      account_circle
                      </span>
                      <span class="label">My Account</span>
                  </NuxtLink>
                <NuxtLink to="/login">
                  <button class="logout-btn">
                    <span class="material-symbols-outlined icon">logout</span>
                    <span class="label">Logout</span>
                  </button>
                </NuxtLink>
              </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 xl:mr-96 ml-14 lg:ml-64 p-4">
          <slot/>
      </main>

      <button
        :class="['fixed right-4 top-4  text-white px-4 py-2 rounded-full shadow-lg z-50 xl:hidden flex flex-row justify-center',
          showCart? 'bg-red-600':'bg-blue-600'
        ]"
        @click="toggleCart">
        <span class="material-symbols-outlined text-white mr-2">{{showCart?'close':'shopping_cart'}}</span>
        {{ cart.cartItems.length }}
      </button>
      
      <!--Each Cart Item-->
      <aside :class="[
            'w-96 lg:w-96 bg-white border-l border-gray-200 p-4 fixed top-0 right-0 h-screen transition-transform duration-300',
            showCart? 'translate-x-0' : 'translate-x-full',
            'xl:translate-x-0 flex flex-col justify-between'
          ]">

          <div class="flex-1 max-h-[90%] overflow-y-auto">
              <h2 class="text-lg font-semibold mb-4 pl-4">My Order</h2>
              <div class=" space-y-2" v-if="cart.cartItems.length!==0">
                  <EachCartItem v-for="item in cart.cartItems" :item="item"/>
              </div>
              <div v-else class="flex flex-col items-center justify-center text-center gap-2 py-20">
                <p class="text-red-600 text-lg font-semibold">No Items in Cart</p>
                <p class="text-red-600 text-sm">Added Menu Items Appear Here</p>
              </div>
          </div>

          <div class="border-t pt-2 px-2">
              <div class="flex flex-row w-full justify-between">
                  <span class="text-lg font:medium">Total Amount</span>
                  <span class="text-blue-700 font:medium text-lg">Rs. {{cart.totalAmount}}</span>
              </div>
              <button class="bg-blue-600 w-full py-2 mt-4 rounded-md text-white font-medium
                          hover:bg-blue-700"
              >Checkout</button>
          </div>
      </aside>
    </div>
</template>


<script lang="ts" setup>
  import EachCartItem from '@/components/user/EachCartItem.vue';
  import { useCartStore } from '@/stores/cart';
  const cart = useCartStore();
  const showCart = ref<boolean>(false);

  const toggleCart = () =>{
    showCart.value = !showCart.value;
  }
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900
        justify-center lg:justify-start;
}

.logout-btn {
  @apply w-full flex items-center gap-3 px-3 rounded-md py-2 text-red-600 hover:bg-red-50 hover:text-red-700
         justify-center lg:justify-start font-medium;
}

.icon {
  font-size: 24px;
  color: rgb(100, 100, 100);
}

.label {
  @apply hidden lg:inline;
}

.router-link-active {
  @apply bg-gray-200 font-semibold text-gray-900;
}

.router-link-active > .icon{
  @apply text-blue-500
}
</style>
