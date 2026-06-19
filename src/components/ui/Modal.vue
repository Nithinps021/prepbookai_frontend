<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6" @click.self="close">
        <Transition name="scale">
          <div 
            v-if="modelValue" 
            class="bg-background rounded-2xl shadow-hover w-full max-w-md overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 class="text-lg font-semibold text-text-primary">{{ title }}</h3>
              <button @click="close" class="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500">
                <X class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[70vh]">
              <slot></slot>
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-border bg-surface/50 flex justify-end gap-3">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
