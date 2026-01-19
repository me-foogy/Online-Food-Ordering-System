<script setup lang="ts">
    import HistoryCard from '@/components/user/HistoryCard.vue';
    import { orderData } from '../admin/orderData';
    //static data <TODO> add api for history data

    definePageMeta({
        layout: 'user'
    })
</script>

<template>
    <h1 class="text-4xl font-bold mb-8 text-blue-600">Order History</h1>
    <div class="w-full">
        <HistoryCard v-for="(order, index) in orderData" :key="index" :order="order"/>
    </div>
</template>

