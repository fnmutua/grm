<script setup>
definePageMeta({
  layout: "landing",
 });

 import { ref } from "vue";
 
 const defaultValue = 'item-1'

const accordionItems = [
  { value: 'item-1', title: 'Is it accessible?', content: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  { value: 'item-2', title: 'Is it unstyled?', content: 'Yes. It\'s unstyled by default, giving you freedom over the look and feel.' },
  { value: 'item-3', title: 'Can it be animated?', content: 'Yes! You can use the transition prop to configure the animation.' },
]
 
</script>
 



<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Main Dashboard</template>
      <template v-slot:desc
        >Charts n maps here.</template
      >
    </LandingSectionhead>
 
    <div class="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
       
      </div>
  </LandingContainer>
</template>
