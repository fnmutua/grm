<template>
     <div class="stat-card "  :class="class">
      <div class="stat-icon">
         <UIcon :name=icon  color="green"/>
      </div>
      <div class="stat-info">
        <h3>{{ title }}</h3>
        <p>{{ value }}</p>
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
    class: {
      type: String,
      default: '',
    },
  })
  </script>
  
  <style scoped>
  .stat-card {
    display: flex;
    align-items: center;
    width:100%;
    padding: 15px;
    border-radius: 15px; /* Updated for rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Updated for shadow */
  }
  
  .stat-icon {
    font-size: 1em;
    margin-right: 15px;
  }
  
  .stat-info h3 {
    margin: 0;
    font-size: 1em;
  }
  
  .stat-info p {
    margin: 2px 0 0;
    font-size: 1.5em;
    font-weight: bold;
  }
  </style>
  