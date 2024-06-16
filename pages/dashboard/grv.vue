 

<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">
     

    <!-- Side Navigation for medium and larger screens -->
    <div  class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 p-4">
       
            
          
    </div>
  </div>
   

     
</template>


 <script setup>
 definePageMeta({
   layout: "landing",
 });
 
  
   
  
 </script>

<style scoped>
.el-table th {
  color: black;
}
</style>

<style scoped>
.checkbox-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  /* Adjust the gap between columns as needed */
}

.italic {
  font-style: italic;
}

.highlight {
  font-weight: bold;
  color: green;
  margin-bottom: 20px;
}
</style>

