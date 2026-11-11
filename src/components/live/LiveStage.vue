<template>
  <div class="lv-stage-wrap">
    <div class="lv-stage" :style="{ transform: `translate(-50%, -50%) scale(${scale})` }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Fixed 1920x1080 canvas scaled to fit the window, so slide layout is identical on any projector.
import { onBeforeUnmount, onMounted, ref } from 'vue'

const scale = ref(1)
function fit() {
  scale.value = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
}
onMounted(() => {
  fit()
  window.addEventListener('resize', fit)
})
onBeforeUnmount(() => window.removeEventListener('resize', fit))
</script>
