<template>
  <div :class="['animate-pulse bg-surface/80 rounded-md', variants[variant]]"></div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: (val) => ['text', 'title', 'card', 'avatar', 'paragraph'].includes(val)
  }
})

const variants = {
  text: 'h-4 w-3/4',
  title: 'h-6 w-1/2',
  card: 'h-32 w-full rounded-xl',
  avatar: 'h-10 w-10 rounded-full',
  paragraph: 'h-24 w-full'
}
</script>
