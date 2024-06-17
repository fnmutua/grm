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
            <StatCard title="Total" :value="total_grievances" :change="per_change.Total" icon="i-heroicons-chat-bubble-left-right-20-solid"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Open" :value="open_grievances" icon="i-heroicons-rectangle-stack-20-solid" :change="per_change.Open"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Resolved" :value="resolved_grievances" icon="i-heroicons-clipboard-document-check-solid" :change="per_change.Resolved"
              changeType="decrease" class="bg-white dark:bg-transparent border" />
            <StatCard title="Escalated" :value="escalated_grievances" icon="i-heroicons-paper-airplane-solid"  :change="per_change.Escalated"
              changeType="increase" class="bg-white dark:bg-transparent border" />
          </div>

          <UDivider label="**" class=" pt-4" />

          <UAccordion color="primary" variant="soft" size="sm" open-icon="i-heroicons-plus"
            close-icon="i-heroicons-minus" :items="[
              { label: 'Summary', slot: 'Summary', defaultOpen: true, },
              { label: 'Gender Based Violence Grievances', slot: 'GBV' },]">

            <template #GBV>
              <div>
                <highchart :options="lineMonthlyGBVChartByGender" more :modules="['exporting']"
                  class="bg-white dark:bg-transparent border" />
              </div>
            </template>

            <template #Summary>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 divide-x divide-y divide-dashed">
                <div>
                  <highchart :options="MonthlyChartByGender" more :modules="['exporting']" />
                </div>

                <div>
                  <highchart :options="MonthlyChartBySettlement" more :modules="['exporting']" />
                </div>


                <div>
                  <highchart :options="lineMonthlyGBVChart" more :modules="['exporting']" />
                </div>
                
                <div>
                  <highchart :options="lineMonthlyChart" more :modules="['exporting']" />
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
const per_change =ref({Open:0, Escalated:0, Resolved:0, Investigate:0, Total:0})
 
onMounted(async () => {
  open_grievances.value = await getSummary('Open')
  resolved_grievances.value = await getSummary('Resolved')
  escalated_grievances.value = await getSummary('Escalated')
  total_grievances.value = await getTotalSummary()

  console.log(open_grievances.value, escalated_grievances.value)
   per_change.value= await getPercentageSummary()


   // get overall summary 
   
   let data  =await getMonthlySummary()
   lineMonthlyChart.value.xAxis.categories=data.dates
   lineMonthlyChart.value.series=data.series

  // Monthly summary by gender 
   let grv_gender_data  =await getMonthlySummaryByGender()
      MonthlyChartByGender.value.xAxis.categories=grv_gender_data.dates
      MonthlyChartByGender.value.series=grv_gender_data.series

  // Monthly summary by settlement 
  let grv_sett_data  =await getMonthlySummaryBySettlement()
      MonthlyChartBySettlement.value.xAxis.categories=grv_sett_data.dates
      MonthlyChartBySettlement.value.series=grv_sett_data.series

   // get GBV  summary 

   let gbv_data  =await getMonthlyGBVSummary()
   lineMonthlyGBVChart.value.xAxis.categories=gbv_data.dates
   lineMonthlyGBVChart.value.series=gbv_data.series

 

      // get GBV  summary  by Gender
      let gbv_gender_data  =await getMonthlyGBVSummaryByGender()
      lineMonthlyGBVChartByGender.value.xAxis.categories=gbv_gender_data.dates
      lineMonthlyGBVChartByGender.value.series=gbv_gender_data.series


      


   
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


async function getMonthlySummary() {
  
  try {
    const response = await axios.post('/api/summary/monthly', {

     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      //return response.data.data
      let res = response.data
      console.log('res',res)
      return res
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

async function getMonthlyGBVSummary() {
  
  try {
    const response = await axios.post('/api/summary/gbv', {

     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      //return response.data.data
      let res = response.data
      console.log('res',res)
      return res
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

async function getMonthlyGBVSummaryByGender() {
  
  try {
    const response = await axios.post('/api/summary/gbvbygender', {

     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      //return response.data.data
      let res = response.data
      console.log('res',res)
      return res
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

async function getMonthlySummaryByGender() {
  
  try {
    const response = await axios.post('/api/summary/grvbygender', {

     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      //return response.data.data
      let res = response.data
      console.log('res',res)
      return res
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}


async function getMonthlySummaryBySettlement() {
  
  try {
    const response = await axios.post('/api/summary/grvbysettlement', {

     });

    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log(response)
      //return response.data.data
      let res = response.data
      console.log('res',res)
      return res
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}

 
 

const lineMonthlyChart = ref({
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',

        },
        title: {
            text: 'Monthly Average Cases Reported',
            align: 'left'
        },
        subtitle: {
            text: 'Source: ' +
                '<a href="https://kesmis.go.ke" target="_blank">kesmis.go.ke</a>'
        },
        xAxis: {
            categories:  []
        },
        yAxis: {
            title: {
                text: 'Number of Cases'
            },
            animation: {
                defer: 1000
            }
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: []
    });

 const lineMonthlyGBVChart = ref({
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',

        },
        title: {
            text: 'Monthly GBV Cases Reported',
            align: 'left'
        },
        subtitle: {
            text: 'Source: ' +
                '<a href="https://kesmis.go.ke" target="_blank">kesmis.go.ke</a>'
        },
        xAxis: {
            categories:  []
        },
        yAxis: {
            title: {
                text: 'Number of Cases'
            },
            animation: {
                defer: 1000
            }
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: []
    });

 
  const lineMonthlyGBVChartByGender = ref({
    chart: {
        type: 'column',
        backgroundColor: 'transparent',

    },
    title: {
        text: 'Monthly GBV Cases Reported by Gender',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://kesmis.go.ke" target="_blank">kesmis.go.ke</a>'
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: 'Number of Cases'
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal', // Enable stacking
            dataLabels: {
                enabled: true
            }
        }
    },
    series: []
});


const MonthlyChartByGender = ref({
    chart: {
        type: 'column',
        backgroundColor: 'transparent',

    },
    title: {
        text: 'GRV Cases Reported by Gender',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://kesmis.go.ke" target="_blank">kesmis.go.ke</a>'
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: 'Number of Cases'
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal', // Enable stacking
            dataLabels: {
                enabled: true
            }
        }
    },
    series: []
});


const MonthlyChartBySettlement = ref({
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        zooming: {
            type: 'x',
            singleTouch: true
        }
    },
    title: {
        text: 'GRV Cases Reported by Settlement',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://kesmis.go.ke" target="_blank">kesmis.go.ke</a>'
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: 'Number of Cases'
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal', // Enable stacking
            dataLabels: {
                enabled: true
            }
        }
    },
    series: []
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
