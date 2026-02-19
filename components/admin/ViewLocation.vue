<script setup lang="ts">

    import type {LatLng} from 'leaflet';

    const config=useRuntimeConfig();
    const storeLat=Number(config.public.storeLat);
    const storeLng=Number(config.public.storeLng);
    const deliveryRadius=Number(config.public.deliveryRadius);

    const props = defineProps<{
        isOpen: boolean
        currentLocation?: [number, number]|null
    }>()

    const emit = defineEmits<{
        'close':[]
    }>()

    type locationSelectEventType={
        latlng: LatLng
    }
    const orderLocation = ref<[number, number]|null>(null)

    watch(() => props.isOpen, (isOpen) => {
        if (isOpen && props.currentLocation) {
            orderLocation.value = props.currentLocation
        }
    })

    const handleClose = () =>{
        orderLocation.value=null;
        emit('close');
    }
</script>

<template>
  <teleport to="body">
        <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md aspect-square">
        
                <p class="mt-2 text-center text-sm lg:text-lg">Order Location Details</p>
                
                <ClientOnly>
                    <LMap
                        ref="map"
                        :zoom="12"
                        :center="[storeLat, storeLng]"
                        :use-global-leaflet="false"
                    >
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                        layer-type="base"
                        name="OpenStreetMap"
                    />
                    <LMarker
                        v-if="orderLocation"
                        :lat-lng="orderLocation"
                        :draggable="false"
                    />
                    <LCircle
                        :lat-lng="[storeLat, storeLng]"
                        :radius="deliveryRadius"
                        :color="'green'"
                    />
                    </LMap>
                </ClientOnly>

                <!-- Action Button -->
                <div class="flex justify-end mt-4 space-x-3">
                    <button 
                        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-sm"
                        @click="handleClose"
                    >
                        <span class="material-symbols-outlined text-base">cancel</span>
                        Close
                    </button>
                </div>
            </div>
        </div>
  </teleport>
</template>