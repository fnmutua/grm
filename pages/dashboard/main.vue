<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">


    <!-- Side Navigation for medium and larger screens -->
    <div class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 p-4">
      <div class="flex-1 flex flex-col">
        <main>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total" :value="total_grievances" :change="per_change.Open" icon="i-heroicons-megaphone"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Open" :value="open_grievances" icon="i-heroicons-hand-thumb-up" :change="per_change.Open"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Resolved" :value="resolved_grievances" icon="i-heroicons-phone-arrow-down-left" :change="per_change.Resolved"
              changeType="decrease" class="bg-white dark:bg-transparent border" />
            <StatCard title="Escalated" :value="escalated_grievances" icon="i-heroicons-hand-thumb-down"  :change="per_change.Escalated"
              changeType="increase" class="bg-white dark:bg-transparent border" />
          </div>

          <UDivider label="**" class=" pt-4" />

          <UAccordion color="primary" variant="soft" size="sm" open-icon="i-heroicons-plus"
            close-icon="i-heroicons-minus" :items="[
              { label: 'Summary', slot: 'Summary', defaultOpen: true, },
              { label: 'Gender Based Violence Grievances', slot: 'GBV' },]">

            <template #GBV>
              <div>
                <highchart :options="chartOpts3" more :modules="['exporting']"
                  class="bg-white dark:bg-transparent border" />
              </div>
            </template>

            <template #Summary>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 divide-x divide-dashed">
                <div>
                  <highchart :options="chartOpts3" more :modules="['exporting']" />
                </div>

                <div>
                  <highchart :options="chartOpts2" more :modules="['exporting']" />
                </div>
              </div>
            </template>

          </UAccordion>
          <div>



          </div>



        </main>
      </div>



    </div>
  </div>



</template>


<script setup>
definePageMeta({
  layout: "landing",
});
import axios from 'axios';
import { ref, computed, watch } from 'vue';


/// KPIX
const total_grievances =ref(0)
const open_grievances =ref(0)
const resolved_grievances =ref(0)
const escalated_grievances =ref(0)
const per_change =ref({Open:10, Escalated:10, Resolved:10, Investigate:10})

onMounted(async () => {
  open_grievances.value = await getSummary('Open')
  resolved_grievances.value = await getSummary('Resolved')
  escalated_grievances.value = await getSummary('Escalated')
  total_grievances.value = await getTotalSummary()

  console.log(open_grievances.value, escalated_grievances.value)
   per_change.value= await getPercentageSummary()

   console.log('per_change.value',per_change.value)


});

async function getTotalSummary() {
  
  try {
    const response = await axios.post('/api/summary/total', {
    
     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      return response.data.data
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

async function getSummary(status) {
  
  try {
    const response = await axios.post('/api/summary/count', {
      status: status,
     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      return response.data.data
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}


async function getPercentageSummary() {
  
  try {
    const response = await axios.post('/api/summary/change', {

     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      //return response.data.data
      let res = response.data.data

      const formattedData = {};
  for (const [key, value] of Object.entries(res)) {
    formattedData[key] = parseFloat(value.toFixed(0));
  }

  return formattedData;
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

 
const chartOpts2 = {

  chart: {
    backgroundColor: 'transparent'
  },
  title: {
    text: 'Grievance Reporting Rates',
    align: 'left'
  },
  xAxis: {
    categories: [
      'Chaani', 'Kisumu Ndogo', 'Kibera', 'Mjini', 'Kicheko'
    ]
  },
  yAxis: {
    title: {
      text: 'Cases'
    }
  },
  tooltip: {
    valueSuffix: ' Cases'
  },
  plotOptions: {
    series: {
      borderRadius: '25%'
    }
  },
  series: [{
    type: 'column',
    name: 'GBV',
    color: 'pink',
    data: [59, 83, 65, 228, 184]
  }, {
    type: 'column',
    name: 'Other',
    color: 'blue',
    data: [24, 79, 72, 240, 167]
  }, {
    type: 'pie',
    name: 'Cases',
    data: [{
      name: 'GBV',
      y: 619,
      color: 'pink',
      dataLabels: {
        enabled: true,
        distance: -50,
        format: '{point.total} M',
        style: {
          fontSize: '15px'
        }
      }
    }, {
      name: 'Other',
      y: 586,
      color: 'blue'
    }],
    center: [75, 65],
    size: 100,
    innerSize: '70%',
    showInLegend: false,
    dataLabels: {
      enabled: false
    }
  }]
}



const chartOpts3 = {
  chart: {
    type: 'column',
    backgroundColor: 'transparent'
  },
  title: {
    text: 'Grievances by gender',
    align: 'left'
  },
  xAxis: {
    categories: ['2020', '2021', '2022', '2023']
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Cases'
    },
    stackLabels: {
      enabled: true
    }
  },
  legend: {
    align: 'left',
    x: 70,
    verticalAlign: 'top',
    y: 70,
    floating: true,
    backgroundColor: 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [{
    name: 'Male',
    color: 'blue',
    data: [3, 5, 1, 13]
  }, {
    name: 'Female',
    color: 'pink',

    data: [14, 8, 8, 12]
  }],
  credits: {
    text: 'kesmis.go.ke',
    href: 'https://kesmis.go.ke'
  },
}

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
