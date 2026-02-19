<script setup lang="ts">

    import type {LatLng} from 'leaflet';
    import {isPointWithinRadius} from 'geolib';

    const config=useRuntimeConfig();
    const storeLat=config.public.storeLat;
    const storeLng=config.public.storeLng;
    const deliveryRadius=config.public.deliveryRadius;

    const props = defineProps<{
        isOpen: boolean
        currentLocation?: [number, number]|null
    }>()

    const emit = defineEmits<{
        'close':[]
        'confirm':[location:[number, number]]
    }>()

    type locationSelectEventType={
        latlng: LatLng
    }
    const selectedLocation = ref<[number, number]|null>(null)

    watch(() => props.isOpen, (isOpen) => {
        if (isOpen && props.currentLocation) {
            selectedLocation.value = props.currentLocation
        }
    })

    const isSelectionValid = computed(()=>{
        if(!selectedLocation.value) return true;
        return isPointWithinRadius(
            {latitude: selectedLocation.value[0], longitude: selectedLocation.value[1]},
            {latitude: storeLat, longitude: storeLng},
            Number(deliveryRadius)
        )
    })

    const handleClose = () =>{
        selectedLocation.value=null;
        emit('close')
    }

    const handleConfirm = () =>{
        if (selectedLocation.value && isSelectionValid.value) {
            emit('confirm', selectedLocation.value)
            selectedLocation.value = null
        }
    }
    

    const handleMapClick = (event: locationSelectEventType) => {
        selectedLocation.value = [event.latlng.lat, event.latlng.lng]
    }
</script>

<template>
  <teleport to="body">
        <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md aspect-square">
        
                <p class="mt-2 text-center text-sm lg:text-lg">Select your location inside the <strong class="text-green-600">Green Area</strong></p>
                <div class="min-h-[1.5rem]">
                    <div v-show="!isSelectionValid" class=" bg-red-100 rounded-md border border-red-300">
                        <p  class="text-red-800 text-xs text-center">
                        Location is outside delivery zone. Please select within the green area.
                        </p>
                    </div>
                </div>
                <LMap
                    ref="map"
                    :zoom="12"
                    :center="[storeLat, storeLng]"
                    :use-global-leaflet="false"
                    @click="handleMapClick"
                >
                <LTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                    layer-type="base"
                    name="OpenStreetMap"
                />

                <LMarker
                    v-if="selectedLocation"
                    :lat-lng="selectedLocation"
                    :draggable="true"
                />

                <LCircle
                    :lat-lng="[storeLat, storeLng]"
                    :radius="deliveryRadius"
                    :color="'green'"
                />
                </LMap>

                <!-- Action Buttons -->
                <div class="flex justify-between mt-4 space-x-3">
                    <button 
                        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-sm"
                        @click="handleClose"
                    >
                        <span class="material-symbols-outlined text-base">cancel</span>
                        Cancel
                    </button>

                    <button 
                        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg 
                        hover:bg-red-700 transition shadow-sm hover:shadow-md
                        disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="handleConfirm"
                        :disabled="!isSelectionValid || !selectedLocation"
                    >
                        <span class="material-symbols-outlined text-base">check_circle_outline</span>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
  </teleport>
</template>