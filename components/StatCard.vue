<template>
  <div class="stat-card p-4 rounded-lg shadow-md flex items-center justify-between bg-white " :class="class">
    <div class="flex items-center ">
      <div class="stat-icon text-4xl text-blue-500 mr-4">
        <UIcon :name="icon" />
      </div>
      <div>
        <h3  >{{ title }}</h3>
        <p class="text-2xl font-bold">{{ value }}</p>
      </div>
    </div>
    <div :class="{'text-green-500': changeType === 'increase', 'text-red-500': changeType === 'decrease'}">
      <span v-if="changeType === 'increase'">▲</span>
      <span v-else>▼</span>
      {{ change }}%
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  change: {
    type: String,
    required: true,
  },
  changeType: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.stat-card {
  @apply p-4 rounded-lg shadow-md flex items-center justify-between;
}

.stat-icon {
  @apply text-4xl text-blue-500 mr-4;
}

.stat-info h3 {
  @apply text-xl font-semibold;
}

.stat-info p {
  @apply text-2xl font-bold;
}
</style>
