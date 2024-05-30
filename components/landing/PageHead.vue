<script setup>
defineProps({
  align: {
    default: "center",
  },
});
</script>

<template>
  <div :class="['mt-70', align === 'center' && 'text-center' ]">
    <p class="text-lg mt-10 py-10 text-slate-600" style="margin-bottom: 1px;">
      <slot name="desc">Some description goes here</slot>
    </p>
  </div>
</template>
