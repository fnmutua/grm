<script setup>
defineProps({
  align: {
    default: "center",
  },
});
</script>

<template>
  <div :class="['mt-16 py-10', align === 'center' && 'text-center' ]">

    <h1 class="text-4xl lg:text-5xl font-bold lg:tracking-tight">
      <slot name="title">Title</slot>
    </h1>
    <p class="text-lg mt-4 text-slate-600" style="margin-bottom: 10px;">
      <slot name="desc">Some description goes here</slot>
    </p>
 
    <ULink to="/"  color="gray" active-class="text-primary">  <UIcon name="i-heroicons-home" class="w-5 h-5" />
    </ULink>
 
    
  </div>
</template>
