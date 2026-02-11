<script setup lang="ts">

    const  {category, addCategory, deleteCategory, fetchCategory} = useCategory()
    const props = defineProps<{
    isOpen: boolean
    onClose?: () => void
    }>()

    //INITIAL CATEGORY CALL
    fetchCategory();
    const newCategory = ref<string>('')
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
        <form class="flex gap-3 mb-5" @submit.prevent="()=>addCategory(newCategory)">
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
          <div v-for="eachCategory in category" :key="eachCategory.id"
            class="flex items-center justify-between px-4 py-2 border rounded-md
            hover:bg-gray-50 transition">

            <span class="text-gray-800">{{ eachCategory.name }}</span>

            <button class="flex items-center gap-1 px-3 py-1.5 text-sm
            bg-red-500 text-white rounded-md
            hover:bg-red-600 transition" @click="()=>deleteCategory(eachCategory.id)">
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