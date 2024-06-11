<script setup>
definePageMeta({
  layout: "landing",
 });

 import { ref } from "vue";

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Features',
        icon: 'pi pi-star'
    },
    {
        label: 'Projects',
        icon: 'pi pi-search',
        items: [
            {
                label: 'Components',
                icon: 'pi pi-bolt'
            },
            {
                label: 'Blocks',
                icon: 'pi pi-server'
            },
            {
                label: 'UI Kit',
                icon: 'pi pi-pencil'
            },
            {
                label: 'Templates',
                icon: 'pi pi-palette',
                items: [
                    {
                        label: 'Apollo',
                        icon: 'pi pi-palette'
                    },
                    {
                        label: 'Ultima',
                        icon: 'pi pi-palette'
                    }
                ]
            }
        ]
    },
    {
        label: 'Contact',
        icon: 'pi pi-envelope'
    }
]);
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
      <div class="card">
        <Menubar :model="items" />
    </div>    </div>
  </LandingContainer>
</template>
