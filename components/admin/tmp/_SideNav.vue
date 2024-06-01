<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <!-- <el-radio-button :value="false">expand</el-radio-button>
    <el-radio-button :value="true">collapse</el-radio-button> -->
  </el-radio-group>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- Loop through the links array to generate menu items -->
    <template v-for="(link, index) in links" :key="index">
      <el-sub-menu v-if="link.children" :index="`${index + 1}`">
        <template #title>
          <el-icon><location /></el-icon>
          <span>{{ link.label }}</span>
        </template>
        <!-- Loop through the children of each link to generate menu items -->
        <template v-for="(child, childIndex) in link.children" :key="childIndex">
          <el-menu-item v-if="typeof child === 'string'" :index="`${index + 1}-${childIndex + 1}`">{{ child }}</el-menu-item>
          <el-menu-item-group v-else :title="child.label">
            <el-menu-item v-for="(item, itemIndex) in child.children" :key="itemIndex" :index="`${index + 1}-${childIndex + 1}-${itemIndex + 1}`">{{ item }}</el-menu-item>
          </el-menu-item-group>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="`${index + 1}`" :disabled="link.disabled">{{ link.label }}</el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">

import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'


const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}


// Reactive variable to track sidebar collapse state
const isCollapsed = ref(false);

// Function to toggle sidebar collapse state
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

  const xlinks = [
    // Group 1
    [
      {
        label: 'Dashboards',
        type:'header'
      }
    ],
    // Group 2
    [
      {
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/dashboard/main',
        
      },
      {
        label: 'Contact',
        icon: 'i-heroicons-chart-bar',
        to: '/dashboard/grv'
      },
      {
        label: 'Command Palette',
        icon: 'i-heroicons-command-line',
        to: '/contact'
      }
    ],
    
    // Group 3
    [
      {
        label: 'Grievances',
        type:'header'

      }
    ],
    [ 

      {
        label: 'Pending',
        icon: 'i-heroicons-shield-exclamation',
        to: '/grievances/open'

      },
      {
        label: 'Resolved',
        icon: 'i-heroicons-check',
        to: '/grievances/resolved'

      }
      ,
      {
        label: 'Escalated',
        icon: 'i-heroicons-bars-arrow-up',
        to: '/grievances/escalated'

      }
      


    ],

 // Group 3
     [
      {
        label: 'Admin',
        type:'header'

      }
    ],
    [
      {
        label: 'Users',
        icon: 'i-heroicons-user',
        to: '/admin/users'

      },
      {
        label: 'GRCs',
        icon: 'i-heroicons-user-group'
      },
      
    ],


 // Group  
 [
      {
        label: 'Settings',
        type:'header'

      }
    ],
    [
      {
        label: 'Logs',
        icon: 'i-heroicons-user'
      },
      {
        label: 'Roles',
        icon: 'i-heroicons-user-group'
      },
      {
        label: 'Settlements',
        icon: 'i-heroicons-map-pin'
      }
    ]



  ];

  const links = [
 
  {
    label: 'Dashboards',
    index: '2',
    children: [
      { label: 'Home', index: '1-1' },
      { label: 'GRVs', index: '1-2' },
    ]
  },

  {
    label: 'Grievances',
    index: '2',
    children: [
      { label: 'Pending', index: '2-1' },
      { label: 'Resolved', index: '2-3' },
      { label: 'Escalated', index: '2-4' },
    ]
  },

  {
    label: 'Admin',
    index: '3',
    children: [
      { label: 'Users', index: '3-1' },
      { label: 'GRCs', index: '3-2' },
     ]
  },

  {
    label: 'Settings',
    index: '3',
    children: [
      { label: 'Logs', index: '3-1' },
      { label: 'Roles', index: '3-2' },
      { label: 'Settlements', index: '3-3'  },
     ]
  },

];


  const checkScreenSize = () => {
  // Check if screen size is small (less than or equal to 767px)
  if (window.matchMedia('(max-width: 767px)').matches) {
    isCollapse.value = true; // Set isCollapse to true
  } else {
    isCollapse.value = false; // Set isCollapse to true

  }
};

// Check screen size when component is mounted
onMounted(() => {
  checkScreenSize();
});

// Check screen size when window is resized
const resizeListener = () => {
  checkScreenSize();
};
window.addEventListener('resize', resizeListener);

// Cleanup resize event listener when component is unmounted
onUnmounted(() => {
  window.removeEventListener('resize', resizeListener);
});

  </script>
  
  
  <style scoped>
  /* Your scoped styles go here */
  
  /* Hide sidebar on smaller screens when collapsed */
  @media (max-width: 767px) {
    .place-items-left {
      display: flex;
      flex-direction: column;
    }
  }
  </style>