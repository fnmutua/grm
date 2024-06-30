<template>
  <UCard class="rounded shadow-2xl shadow-cyan-500/50  outline outline-offset-2 outline-green-500">
    <h1>Grievances</h1>
    <div class="statistics">
      <div class="stat-item">
        <span class="stat-title">Received</span>
        <span class="stat-value">{{ Received }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-title">Resolved</span>
        <span class="stat-value">{{ Resolved }}</span>
      </div>
       

       <div class="mb-1 text-base font-medium text-green-700 dark:text-green-500">Resolution Rate</div>
<div class="w-full bg-gray-200 rounded-full h-6  mb-4 dark:bg-gray-700" >
  <div class="bg-green-600 text-xl font-medium text-blue-100 text-center h-6  leading-none rounded-full"
          :style="{ width: `${ResolutionRate}%` }">
          {{ ResolutionRate }}%
        </div>
      </div>
 
 


      <span class="stat-footer">Last Update: {{ lastUpdate }}</span>

    </div>

  </UCard>
</template>


<script>
export default {
  props: {
    Received: {
      type: String,
      required: false,
    },
    Resolved: {
      type: String,
      required: false,
    },
    ResolutionRate: {
      type: String,
      required: false,
    },
    lastUpdate: {
      type: String,
      required: false,
    }
  }
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;



  margin: 20px auto;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 2.2em;
}

.statistics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stat-title {
  font-weight: bold;
  display: flex;

}

.stat-footer {
  justify-content: right;
  font-size: 0.8em;

}

.stat-value {
  font-size: 1.2em;
  color: #2c3e50;
}
</style>