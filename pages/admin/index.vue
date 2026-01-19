<script setup>

    import { useAuthStore } from '@/stores/auth';
    const auth = useAuthStore();

    definePageMeta({
        layout: 'admin' 
    })
</script>

<template>
    <h1 class="">Welcome <br> {{auth.userName}}</h1>
</template>

