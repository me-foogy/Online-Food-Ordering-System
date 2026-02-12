<script lang="ts" setup>
  const {logout} = useAuth();
</script>

<template>
    <div class="min-h-[100dvh] flex bg-gray-100">
      <!-- Sidebar -->
      <aside class="bg-white border-r border-gray-200 w-14 lg:w-64 fixed top-0 left-0 h-[100dvh] flex flex-col">
        <div class="h-full flex flex-col">
            <div class="border-b py-4 flex justify-center lg:justify-start lg:px-6">
                  <span class="hidden lg:block font-semibold text-lg">Admin Panel</span>
                  <span class="material-symbols-outlined lg:hidden">
                      admin_panel_settings
                  </span>
              </div>
              <!-- Navigation -->
              <nav class="flex-1 px-2 py-4 space-y-1">
                  <NuxtLink to="/admin/orders" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      receipt_long
                      </span>
                      <span class="label">Orders</span>
                  </NuxtLink>
                  <NuxtLink to="/admin/menu" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      restaurant_menu
                      </span>
                      <span class="label">Menu Items</span>
                  </NuxtLink>
                  <NuxtLink to="/admin/sales" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      bar_chart
                      </span>
                      <span class="label">Sales</span>
                  </NuxtLink>
                  <NuxtLink to="/admin/transactions" class="nav-link">
                      <span class="material-symbols-outlined icon">
                      attach_money
                      </span>
                      <span class="label">Transactions</span>
                  </NuxtLink>
              </nav>
              <!-- Logout -->
              <div class="p-4 border-t">
                <button class="logout-btn" @click="logout">
                  <span class="material-symbols-outlined icon">logout</span>
                  <span class="label">Logout</span>
                </button>
              </div>
        </div>
      </aside>
      <!-- Main Content -->
      <main class="flex-1 p-2 ml-14 lg:ml-64 lg:p-6">
        <slot />
      </main>
    </div>
</template>

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

