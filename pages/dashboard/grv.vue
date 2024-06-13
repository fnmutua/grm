<script setup>
definePageMeta({
  layout: "landing",
 });
</script>
 



<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>GRV Dashboard</template>
      <template v-slot:desc
        >Charts n maps here.</template
      >
    </LandingSectionhead>
 
    <div class="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
        <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
      <AccordionTrigger>{{ item.title }}</AccordionTrigger>
      <AccordionContent>
        {{ item.content }}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
      </div>
  </LandingContainer>
</template>
