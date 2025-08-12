<template>
  <div class="lazy-image-container" :class="containerClass">
    <div 
      v-if="!imageLoaded && showPlaceholder"
      class="lazy-image-placeholder"
      :class="placeholderClass"
    >
      <slot name="placeholder">
        <div class="animate-pulse bg-gray-200 rounded-md w-full h-full flex items-center justify-center">
          <svg 
            class="w-8 h-8 text-gray-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fill-rule="evenodd" 
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
              clip-rule="evenodd" 
            />
          </svg>
        </div>
      </slot>
    </div>

    <img
      ref="imageRef"
      :src="shouldLoad ? src : undefined"
      :alt="alt"
      :class="[
        'lazy-image',
        imageClass,
        {
          'opacity-0': !imageLoaded,
          'opacity-100': imageLoaded,
          'transition-opacity duration-300': fadeIn
        }
      ]"
      :loading="loading"
      @load="handleImageLoad"
      @error="handleImageError"
    />

    <div 
      v-if="error"
      class="lazy-image-error"
      :class="errorClass"
    >
      <slot name="error">
        <div class="bg-red-50 rounded-md w-full h-full flex items-center justify-center">
          <svg 
            class="w-8 h-8 text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  src: string
  alt?: string
  loading?: 'lazy' | 'eager'
  fadeIn?: boolean
  showPlaceholder?: boolean
  rootMargin?: string
  threshold?: number
  containerClass?: string
  imageClass?: string
  placeholderClass?: string
  errorClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  loading: 'lazy',
  fadeIn: true,
  showPlaceholder: true,
  rootMargin: '50px',
  threshold: 0.1,
  containerClass: '',
  imageClass: '',
  placeholderClass: '',
  errorClass: ''
})

const imageRef = ref<HTMLImageElement>()
const imageLoaded = ref(false)
const error = ref(false)
const shouldLoad = ref(false)
const observer = ref<IntersectionObserver>()

// Use native lazy loading for modern browsers, intersection observer as fallback
const supportsLazyLoading = computed(() => 'loading' in HTMLImageElement.prototype)

const initIntersectionObserver = () => {
  if (supportsLazyLoading.value || typeof window === 'undefined') {
    shouldLoad.value = true
    return
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        shouldLoad.value = true
        observer.value?.disconnect()
      }
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold
    }
  )

  if (imageRef.value) {
    observer.value.observe(imageRef.value)
  }
}

const handleImageLoad = () => {
  imageLoaded.value = true
  error.value = false
}

const handleImageError = () => {
  error.value = true
  imageLoaded.value = false
}

onMounted(() => {
  const initializeImage = async () => {
    await nextTick()
    if (props.loading === 'eager') {
      shouldLoad.value = true
    } else {
      initIntersectionObserver()
    }
  }
  
  initializeImage()
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  display: inline-block;
}

.lazy-image-placeholder,
.lazy-image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>