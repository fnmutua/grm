<script setup>
definePageMeta({
  layout: false,
});
</script>

<template>


  <div class="maintenance-container">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBcBYWudeH_bn6w-LcUzhLPhf9PGhkhy-1Qg&usqp=CAU"
      alt="Maintenance"
      class="maintenance-image"
    />
    <div class="maintenance-content">
      <h1 class="maintenance-title">Website Under Maintenance</h1>
      <p class="maintenance-message">
        We are currently undergoing maintenance. Please check back later.
      </p>
    </div>
  </div>
</template>

<style scoped>
.maintenance-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #f0f0f0;
}

.maintenance-image {
  max-width: 300px;
  margin-bottom: 20px;
}

.maintenance-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.maintenance-message {
  font-size: 18px;
  color: #666;
  text-align: center;
}
</style>