<script lang="ts" setup>
  const { handleLogout } = useLogout();
</script>

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
                  <button class="logout-btn" @click="handleLogout">
                    <span class="material-symbols-outlined icon">logout</span>
                    <span class="label">Logout</span>
                  </button>
              </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-14 lg:ml-64 p-4">
          <slot/>
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

