<script setup lang="ts">
    const authLoading = useState<boolean>('auth:loading');
    const apiLoading =  useState<boolean>('global:loading', ()=>false); 
</script>

<template>
    <div v-if="authLoading || apiLoading" class="fixed inset-0 bg-black/40 flex justify-center items-start pt-5 z-[999]">
        <div class="bg-white p-4 rounded-lg shadow-lg flex flex-row space-x-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
            <span>Loading...</span>
        </div>
    </div>
</template>