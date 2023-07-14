<script setup>
import SlideItem from "@/components/SlideItem.vue";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {getPhotos} from "../services/photos"

// refs to html elements
const mainSliderRef = ref(null)
const sliderWrapperRef = ref(null)

const items = ref([])
const currentSlideIndex = ref(0)
const slidesCount = ref(5)
const currentPage = ref(1)

const slidesSpace = ref(5)
const sliderWidth = ref(mainSliderRef?.value?.clientWidth)

//width of one slide
const slideWidth = computed(() => {
  if (!sliderWidth.value) return 200
  return getSlideWith(sliderWidth.value, slidesCount.value)
})

function getSlideWith(sliderWidth, slidesCount){
  return (sliderWidth - (slidesCount +1) * slidesSpace.value) /slidesCount
}

function calculateSlidesCount(width) {
  if (width < 500) return 1
  if (width < 900) return 3
  return 5
}

function moveSlide(direction) {
  const nextStep = currentSlideIndex.value + direction
  if (nextStep < 0 || nextStep + slidesCount.value > items.value.length) return
  currentSlideIndex.value = nextStep
}

function scroll() {
  if (!sliderWrapperRef.value) return
  sliderWrapperRef.value.style.transform = `translateX(-${(slideWidth.value + slidesSpace.value) * currentSlideIndex.value}px)`
}

watch(currentSlideIndex, () => {
  scroll()
  if (currentSlideIndex.value + slidesCount.value === items.value.length) fetchPhotos()
})

function handleResize() {
  if (mainSliderRef.value) {
    sliderWidth.value = mainSliderRef.value.clientWidth;
    slidesCount.value = calculateSlidesCount(mainSliderRef.value.clientWidth)
    scroll()
  }
}

async function fetchPhotos() {
  const data = await getPhotos(currentPage.value)
  currentPage.value++
  items.value.push(...data)
}

let resizeObserver
// Attach resize observer on mount
onMounted(() => {
  fetchPhotos()

  resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(mainSliderRef.value);
});

// Disconnect resize observer on unmount
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

</script>

<template>
 <div id="main-slider" ref="mainSliderRef" :style="{padding: `${slidesSpace}px`}">
   <div ref="sliderWrapperRef" class="slider-wrapper">
    <SlideItem v-for="item in items" parentId="main-slider" :key="item.id" :photo="item" :style="{width: slideWidth + 'px', marginRight: `${slidesSpace}px`}"/>
   </div>
   <div class="nav-container">
      <button class="nav-button" :disabled="currentSlideIndex === 0" @click="moveSlide(-1)">Сюнди</button>
      <button class="nav-button" @click="moveSlide(1)">Тунди</button>
   </div>
 </div>
</template>

<style scoped>
 #main-slider {
   overflow: hidden;
 }
 .slider-wrapper {
   display: flex;
   height: calc(100% - 30px);
   transition: all 0.3s ease;
   margin-bottom: 5px;
 }
 .nav-container {
   display: flex;
   justify-content: space-between;
 }
 .nav-button {
   background: transparent;
   border: transparent;
   font-size: 20px;
   transition: all .3s ease;
 }
 .nav-button:hover:not([disabled]) {
    color: blue;
    cursor: pointer;
  }
</style>