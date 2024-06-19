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

          <div class="grid grid-cols-1 md:grid-cols-8 gap-6 pt-4">
          <USelect v-model="selected_county"  :options="counties" placeholder="Filter by county"  @change="onSelectCounty" />
        
          <UButton label="Clear Filters" variant="outline" @click="onClearFilters">
            <template #trailing>
              <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
            </template>
          </UButton>
          
        </div>

          <UDivider label="**" class=" pt-2" />

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

const counties =ref([])
const selected_county =ref()

// Flters 

const filter_fields =ref([])
const filter_values =ref([])




// onMounted(async () => {

//   // get Admin Units - Counties
//   let county_data = await getAdminunits('county')

//   // Function to create an array of user objects
//   county_data.forEach((county) => {
//         counties.value.push({
//             label: county.name +'('+county.code+')',
//             value: county.code
//         });
//     });
//     console.log('counties.value ',counties.value )


//   // Get Summaries
//   open_grievances.value = await getSummary('Open')
//   resolved_grievances.value = await getSummary('Resolved')
//   escalated_grievances.value = await getSummary('Escalated')
//   total_grievances.value = await getTotalSummary()

//   console.log(open_grievances.value, escalated_grievances.value)
//    per_change.value= await getPercentageSummary()


//    // get overall summary 
   
//    let data  =await getMonthlySummary()
//    lineMonthlyChart.value.xAxis.categories=data.dates
//    lineMonthlyChart.value.series=data.series

//   // Monthly summary by gender 
//    let grv_gender_data  =await getMonthlySummaryByGender()
//       MonthlyChartByGender.value.xAxis.categories=grv_gender_data.dates
//       MonthlyChartByGender.value.series=grv_gender_data.series

//   // Monthly summary by settlement 
//   let grv_sett_data  =await getMonthlySummaryBySettlement()
//       MonthlyChartBySettlement.value.xAxis.categories=grv_sett_data.dates
//       MonthlyChartBySettlement.value.series=grv_sett_data.series

//    // get GBV  summary 

//    let gbv_data  =await getMonthlyGBVSummary()
//    lineMonthlyGBVChart.value.xAxis.categories=gbv_data.dates
//    lineMonthlyGBVChart.value.series=gbv_data.series

 

//       // get GBV  summary  by Gender
//       let gbv_gender_data  =await getMonthlyGBVSummaryByGender()
//       lineMonthlyGBVChartByGender.value.xAxis.categories=gbv_gender_data.dates
//       lineMonthlyGBVChartByGender.value.series=gbv_gender_data.series


      


   
// });
 
async function fetchSummaries() {
    try {
        const [
            openGrievances,
            resolvedGrievances,
            escalatedGrievances,
            totalSummary,
            percentageSummary,
            monthlySummary,
            monthlySummaryByGender,
            monthlySummaryBySettlement,
            monthlyGBVSummary,
            monthlyGBVSummaryByGender
        ] = await Promise.all([
            getSummary('Open'),
            getSummary('Resolved'),
            getSummary('Escalated'),
            getTotalSummary(),
            getPercentageSummary(),
            getMonthlySummary(),
            getMonthlySummaryByGender(),
            getMonthlySummaryBySettlement(),
            getMonthlyGBVSummary(),
            getMonthlyGBVSummaryByGender(),
            
        ]);

        open_grievances.value = openGrievances;
        resolved_grievances.value = resolvedGrievances;
        escalated_grievances.value = escalatedGrievances;
        total_grievances.value = totalSummary;
        per_change.value = percentageSummary;

        lineMonthlyChart.value.xAxis.categories = monthlySummary.dates? monthlySummary.dates:[];
        lineMonthlyChart.value.series = monthlySummary.series;

        MonthlyChartByGender.value.xAxis.categories = monthlySummaryByGender.dates? monthlySummaryByGender.dates:[];
        MonthlyChartByGender.value.series = monthlySummaryByGender.series;

        MonthlyChartBySettlement.value.xAxis.categories = monthlySummaryBySettlement.dates? monthlySummaryBySettlement.dates: [];
        MonthlyChartBySettlement.value.series = monthlySummaryBySettlement.series;

        lineMonthlyGBVChart.value.xAxis.categories = monthlyGBVSummary.dates? monthlyGBVSummary.dates:[];
        lineMonthlyGBVChart.value.series = monthlyGBVSummary.series;

        lineMonthlyGBVChartByGender.value.xAxis.categories = monthlyGBVSummaryByGender.dates?monthlyGBVSummaryByGender.dates:[];
        lineMonthlyGBVChartByGender.value.series = monthlyGBVSummaryByGender.series;

    } catch (error) {
        console.error('Error fetching summaries:', error);
    }
}

async function clearCharts() {
    try {
        console.log('Clear all data')

        open_grievances.value = null;
        resolved_grievances.value = null;
        escalated_grievances.value = null;
        total_grievances.value = null;
        per_change.value = {Open:0, Escalated:0, Resolved:0, Investigate:0, Total:0};
        

        lineMonthlyChart.value.xAxis.categories =  [];
        lineMonthlyChart.value.series = [];

        MonthlyChartByGender.value.xAxis.categories = [];
        MonthlyChartByGender.value.series = [];

        MonthlyChartBySettlement.value.xAxis.categories =  [];
        MonthlyChartBySettlement.value.series = [];

        lineMonthlyGBVChart.value.xAxis.categories =  [];
        lineMonthlyGBVChart.value.series =  [];

        lineMonthlyGBVChartByGender.value.xAxis.categories =  [];
        lineMonthlyGBVChartByGender.value.series =  [];

    } catch (error) {
        console.error('Error nulllimng summaries:', error);
    }
}

onMounted(async () => {

    await fetchSummaries();
 
      let county_data = await getAdminUnits('county')

      // Function to create an array of user objects
      county_data.forEach((county) => {
            counties.value.push({
                label: county.name +'('+county.code+')',
                value: county.code
            });
        });

});


async function onSelectCounty() {

  await clearCharts()

  console.log('selected_county',selected_county.value)
  filter_fields.value=['county']
  filter_values.value=[selected_county.value.toString()]

  // run the querry with filter 
  //total_grievances.value = await getTotalSummary()
  //per_change.value= await getPercentageSummary()

  await fetchSummaries();

}

async function onClearFilters() {

  // Clear Filters 
  console.log("Clear Filters")
  selected_county.value =null
  filter_fields.value=[]
  filter_values.value=[]
  await fetchSummaries();

}






async function getAdminUnits(model) {
  
  try {
    const response = await axios.post('/api/admin/units/list', {
      model:model
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


async function getTotalSummary() {
  
  try {
    const response = await axios.post('/api/summary/total', {
      filter_fields:filter_fields.value,filter_values:filter_values.value
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
      status: status,filter_fields:filter_fields.value,filter_values:filter_values.value
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
      filter_fields:filter_fields.value,filter_values:filter_values.value
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
      filter_fields:filter_fields.value,filter_values:filter_values.value
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
      filter_fields:filter_fields.value,filter_values:filter_values.value
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
      filter_fields:filter_fields.value,filter_values:filter_values.value
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
      filter_fields:filter_fields.value,filter_values:filter_values.value
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
      filter_fields:filter_fields.value,filter_values:filter_values.value
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
