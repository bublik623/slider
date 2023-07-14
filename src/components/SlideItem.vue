
<script setup>
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
  photo: Object,
  parentId: String
})
const slideItemRef = ref(null)

let intersectionObserver = null

onMounted(() => {
  intersectionObserver = new IntersectionObserver(handleIntersection, {
    rootMargin: '0px',
    threshold: 0.1,
    root: document.getElementById(props.parentId)
  });

  intersectionObserver.observe(slideItemRef.value);

})

onUnmounted(() => {
  if(intersectionObserver) {
    intersectionObserver.disconnect()
  }
})

function handleIntersection (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.backgroundImage = `url(${props.photo.download_url})`;
      intersectionObserver.unobserve(entry.target);
    }
  })
}
</script>

<template>
  <div ref="slideItemRef" class="slide-item">
  </div>
</template>

<style scoped>
  .slide-item {
    display: inline-block;
    height: 100%;
    padding: 5px;
    border-radius: 10px;
    background-size: cover;
    background-position: 50% 50%;
    border: 1px solid rgba(0,0,0, 0.1);
    flex-shrink: 0;
  }
</style>