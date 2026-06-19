<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" :for="id" class="text-sm font-medium text-text-primary">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <div v-if="$slots.prefix" class="absolute left-3 text-text-muted flex items-center pointer-events-none">
        <slot name="prefix"></slot>
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full bg-surface border border-border rounded-md text-sm text-text-primary transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 hover:border-text-muted',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
          $slots.prefix ? 'pl-10' : 'pl-3',
          $slots.suffix ? 'pr-10' : 'pr-3',
          'py-2'
        ]"
      />
      <div v-if="$slots.suffix" class="absolute right-3 text-text-muted flex items-center">
        <slot name="suffix"></slot>
      </div>
    </div>
    <span v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
