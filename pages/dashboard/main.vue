<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-1">
    <!-- Side Navigation for medium and larger screens -->
    <div class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 p-4">
      <div class="flex-1 flex flex-col">
        <main>
          <UProgress v-show="loading" animation="carousel" class="pb-6" />

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

          <div class="flex justify-between items-center pt-4">
            <div class="flex space-x-4">
                <USelect v-model="selected_county" :options="counties" placeholder="Filter by county" @change="onSelectCounty" />
                <USelect v-if="selected_county" v-model="selected_subcounty" :options="subcounties" placeholder="Filter by subcounty" @change="onSelectSUbCounty" />
                <USelect v-if="selected_subcounty" v-model="selected_ward" :options="wards" placeholder="Filter by ward" @change="onSelectWards" />
                <UButton label="Clear Filters" color="red" variant="outline" @click="onClearFilters">
                <template #trailing>
                    <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
                </template>
                </UButton>
            </div>
            <ColorMode />
            </div>


          <UDivider label="**" class=" pt-2" />

          <UAccordion color="primary" variant="soft" size="sm" open-icon="i-heroicons-plus"
            close-icon="i-heroicons-minus" :items="[
              { label: 'Summary', slot: 'Summary', defaultOpen: true, },
              { label: 'Gender Based Violence Grievances', slot: 'GBV' },]">

            <template #GBV>
              <div>
                <highchart :options="lineMonthlyByStatus" more :modules="['exporting']"
                  class="bg-white dark:bg-transparent border" />
              </div>
            </template>

            <template #Summary>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <div>
                             
                    <div class="block  bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <div class="font-normal text-gray-700 dark:text-gray-400"> 
                                <highchart :options="MonthlyChartByGender" more :modules="['exporting']" />
                            </div>
                    </div> 
                </div>   

                <div class="block  bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div class="font-normal text-gray-700 dark:text-gray-400"> 
                        <highchart :options="MonthlyChartByLocation" more :modules="['exporting']" />
                    </div>
                </div>

 

                   
                <div class="block  bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div class="font-normal text-gray-700 dark:text-gray-400"> 
                        <highchart :options="lineMonthlyByType" more :modules="['exporting']" />
                    </div>
                </div>

 

                   
                <div class="block  bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div class="font-normal text-gray-700 dark:text-gray-400"> 
                        <highchart :options="resolutionRateGauge" more :modules="['exporting']" />
                    </div>
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
  //layout: "landing",
  middleware: 'auth',

});

import axios from 'axios';
import { ref, computed, watch } from 'vue';
 

/// KPIX
const total_grievances =ref(0)
const open_grievances =ref(0)
const resolved_grievances =ref(0)
const escalated_grievances =ref(0)
const per_change =ref({Open:0, Escalated:0, Resolved:0, Investigate:0, Total:0})
const resolution_rate=ref(0)
const counties =ref([])
const selected_county =ref()
const selected_subcounty =ref()
const selected_ward =ref()


// Flters 

const filter_fields =ref([])
const filter_values =ref([])
const loading =ref(false)
// process count data 

function transformCountData(data) {
    return data.reduce((acc, item) => {
        const status = item._id.status;
        acc[status] = {
            totalCount: item.totalCount,
            totalGBV: item.totalGBV
        };
        return acc;
    }, {});
} 

 
// process gedner data 
function extractGenderData(data) {
    const categories = [];
    const totalCountSeries = [];
    const totalGBVSeries = [];
    const totalNonGBVSeries = [];
    console.log('extractGenderData')

    data.forEach(item => {
        categories.push(item._id.gender);
        totalCountSeries.push(item.totalCount);
        totalGBVSeries.push(item.totalGBV);
        totalNonGBVSeries.push(item.totalNonGBV);
    });

    return {
        categories,
        totalCountSeries,
        totalGBVSeries,
        totalNonGBVSeries
    };
}

// Process County data 

 async function processCountyData(data) {
    // Initialize containers for the categories and series data
    let categories = [];
    let seriesData = {
        Open: [],
        Resolved: [],
        Escalated: [],
        Investigate: []
    };
 
    // Loop through the data to populate categories and series
    data.forEach(item => {
        const county = item._id.county;
        const status = item._id.status;
        const totalCount = item.totalCount;
      //  console.log('categories', categories);
        console.log('county', county);

        // Add county to categories if it's not already there
        if (!categories.includes(county)) {
            categories.push(county);
            // Initialize new entries in series arrays for the new county
            Object.keys(seriesData).forEach(statusKey => {
                seriesData[statusKey].push(0);
            });
        }

        // Find the index of the county in categories
        const index = categories.indexOf(county);

        // Ensure that status exists in seriesData before assigning the value
        if (!seriesData.hasOwnProperty(status)) {
            seriesData[status] = new Array(categories.length).fill(0);
        }

        // Assign the totalCount to the respective series at the county index
        seriesData[status][index] = totalCount;
      //  console.log(`seriesData[${status}][${index}]`, seriesData[status]);
    });

   // console.log('Loop has completed successfully.');

    // Convert seriesData to the desired format
    const series = Object.keys(seriesData).map(status => {
        return {
            name: status,
            data: seriesData[status]
        };
    });

    return { categories, series };
}

// Process County data 
async function procesSubCountyData(data) {
    // Initialize containers for the categories and series data
    let categories = [];
    let seriesData = {
        Open: [],
        Resolved: [],
        Escalated: [],
        Investigate: []
    };
 
    // Loop through the data to populate categories and series
    data.forEach(item => {
        const subcounty = item._id.subcounty;
        const status = item._id.status;
        const totalCount = item.totalCount;
        console.log('subcounty',subcounty)
    
        // Add subcounty to categories if it's not already there
        if (!categories.includes(subcounty)) {
            categories.push(subcounty);
            // Initialize new entries in series arrays for the new county
            Object.keys(seriesData).forEach(statusKey => {
                seriesData[statusKey].push(0);
            });
        }

        // Find the index of the county in categories
        const index = categories.indexOf(subcounty);

        // Ensure that status exists in seriesData before assigning the value
        if (!seriesData.hasOwnProperty(status)) {
            seriesData[status] = new Array(categories.length).fill(0);
        }

        // Assign the totalCount to the respective series at the county index
        seriesData[status][index] = totalCount;
      //  console.log(`seriesData[${status}][${index}]`, seriesData[status]);
    });

     console.log('Loop has completed successfully.');

    // Convert seriesData to the desired format
    const series = Object.keys(seriesData).map(status => {
        return {
            name: status,
            data: seriesData[status]
        };
    });

    return { categories, series };
}

async function procesWardData(data) {
    // Initialize containers for the categories and series data
    let categories = [];
    let seriesData = {
        Open: [],
        Resolved: [],
        Escalated: [],
        Investigate: []
    };
 
    // Loop through the data to populate categories and series
    data.forEach(item => {
        const ward = item._id.ward;
        const status = item._id.status;
        const totalCount = item.totalCount;
        console.log('ward',ward)
    
        // Add ward to categories if it's not already there
        if (!categories.includes(ward)) {
            categories.push(ward);
            // Initialize new entries in series arrays for the new county
            Object.keys(seriesData).forEach(statusKey => {
                seriesData[statusKey].push(0);
            });
        }

        // Find the index of the county in categories
        const index = categories.indexOf(ward);

        // Ensure that status exists in seriesData before assigning the value
        if (!seriesData.hasOwnProperty(status)) {
            seriesData[status] = new Array(categories.length).fill(0);
        }

        // Assign the totalCount to the respective series at the county index
        seriesData[status][index] = totalCount;
      //  console.log(`seriesData[${status}][${index}]`, seriesData[status]);
    });

     console.log('Loop has completed successfully.');

    // Convert seriesData to the desired format
    const series = Object.keys(seriesData).map(status => {
        return {
            name: status,
            data: seriesData[status]
        };
    });

    return { categories, series };
}
async function procesSettlementData(data) {
    // Initialize containers for the categories and series data
    let categories = [];
    let seriesData = {
        Open: [],
        Resolved: [],
        Escalated: [],
        Investigate: []
    };
 
    // Loop through the data to populate categories and series
    data.forEach(item => {
        const settlement = item._id.settlement;
        const status = item._id.status;
        const totalCount = item.totalCount;
        console.log('settlement',settlement)
    
        // Add ward to categories if it's not already there
        if (!categories.includes(settlement)) {
            categories.push(settlement);
            // Initialize new entries in series arrays for the new county
            Object.keys(seriesData).forEach(statusKey => {
                seriesData[statusKey].push(0);
            });
        }

        // Find the index of the county in categories
        const index = categories.indexOf(settlement);

        // Ensure that status exists in seriesData before assigning the value
        if (!seriesData.hasOwnProperty(status)) {
            seriesData[status] = new Array(categories.length).fill(0);
        }

        // Assign the totalCount to the respective series at the county index
        seriesData[status][index] = totalCount;
      //  console.log(`seriesData[${status}][${index}]`, seriesData[status]);
    });

     console.log('Loop has completed successfully.');

    // Convert seriesData to the desired format
    const series = Object.keys(seriesData).map(status => {
        return {
            name: status,
            data: seriesData[status]
        };
    });

    return { categories, series };
}



// Month GBV nonGBv 
function processMonthlySeries(data) {
    // Initialize arrays for categories (year-month pairs) and series (totalCount, totalGBV, totalNonGBV)
    let categories = [];
  
  // Initialize new series objects for totalCount, totalGBV, and totalNonGBV
  let totalCountData = {
                name: 'Total Count',
                data: []
            };
   let totalGBVData = {
                name: 'Total GBV',
                data: []
            };
    let totalNonGBVData = {
                name: 'Total Non-GBV',
                data: []
            };

    // Iterate over each result object in the 'data' array
    data.forEach(result => {
        // Extract year, month, and status from _id
        let year = result._id.year;
        let month = result._id.month;
 
        // Create a formatted date string for the category
        let category = `${year}-${month}`;

        // Check if the category already exists in categories array
        let categoryIndex = categories.findIndex(item => item === category);
        if (categoryIndex === -1) {
            // If category does not exist, add it to categories array
            categories.push(category);

          
            // Push the series objects into respective series arrays
            totalCountData.data.push(result.totalCount);
            totalGBVData.data.push(result.totalGBV);
            totalNonGBVData.data.push(result.totalNonGBV);

            // Update categoryIndex to the newly added category's index
            categoryIndex = categories.length - 1;
        }

        
    });

    // Return an object containing categories and series arrays
    return {
        categories: categories,
        series: [totalCountData, totalGBVData, totalNonGBVData]
    };
}
 
 // Month GBV nonGBv 
 function processMonthlyStatus(data) {
    // Initialize arrays for categories (year-month pairs) and series (status with totalCount data)
    let categories = [];
    let series = {};

    // Iterate over each result object in the 'data' array
    data.forEach(result => {
        // Extract year, month, and status from _id
        let year = result._id.year;
        let month = result._id.month;
        let status = result._id.status;

        // Create a formatted date string for the category
        let category = `${year}-${month}`;

        // Check if the category already exists in categories array
        if (!categories.includes(category)) {
            // If category does not exist, add it to categories array
            categories.push(category);
        }

        // Initialize series data object for the status if not already initialized
        if (!series[status]) {
            series[status] = {
                name: status,
                data: []
            };
        }

        // Push totalCount value to the series data array for the corresponding category
        series[status].data.push( result.totalCount);
    });

    // Return an object containing categories and series arrays
    return {
        categories: categories,
        series: Object.values(series)
    };
}
 


async function fetchSummaries() {
  //  console.log('fetchSummaries>>>>>')
    try {
        const [
            AllSummary,
            percentageSummary,
        ] = await Promise.all([
              getAllSummary(),
              getPercentageSummary(),
             
            
        ]);
          // 1. get the total 
        total_grievances.value=AllSummary.total

        // 2. Process Count data 
          let status_data = await transformCountData(AllSummary.byStatusOnly)
          open_grievances.value = status_data['Open'] ? status_data['Open'].totalCount || 0 : 0;
          resolved_grievances.value = status_data['Resolved'] ? status_data['Resolved'].totalCount || 0 : 0;
          escalated_grievances.value = status_data['Escalated'] ? status_data['Escalated'].totalCount || 0 : 0;


        // 3. Monthly Changes in the Totals  
        per_change.value = percentageSummary?percentageSummary:[]


        //4. Gedner 
        let gender_data=   extractGenderData(AllSummary.byGenderOnly)  

        MonthlyChartByGender.value.xAxis.categories = gender_data.categories;
        MonthlyChartByGender.value.series =  [{name:'All', data:gender_data.totalCountSeries}, {name:'GBV', data:gender_data.totalGBVSeries},{name:'Non-GBV', data:gender_data.totalNonGBVSeries}];

        //5. Process county data 
        console.log('selected_level.value', selected_level.value)
        if( selected_level.value ==='county') {
            console.log('Get subcountychrts')
            let county_data = await procesSubCountyData(AllSummary.bySubCountyStatus)
            MonthlyChartByLocation.value.xAxis.categories = county_data.categories
             MonthlyChartByLocation.value.series = county_data.series;
        }
        else if(selected_level.value==='subcounty') {
            console.log('Get ward charts')

            let sett_data = await procesWardData(AllSummary.bySubWardStatus)
            MonthlyChartByLocation.value.xAxis.categories = sett_data.categories
             MonthlyChartByLocation.value.series = sett_data.series;
        }
        else if(selected_level.value==='ward') {
            console.log('Get settl charts')

            let ward_data = await procesSettlementData(AllSummary.bySubSettlementStatus)
            MonthlyChartByLocation.value.xAxis.categories = ward_data.categories
             MonthlyChartByLocation.value.series = ward_data.series;
        }
        else {
            console.log('Get National charts')

            let county_data = await processCountyData(AllSummary.byCountyStatus)
            MonthlyChartByLocation.value.xAxis.categories = county_data.categories
             MonthlyChartByLocation.value.series = county_data.series;
        }
      



        
        //6. Timeseries by type
        let timeseries_data =  processMonthlySeries(AllSummary.byMonth)
         
        lineMonthlyByType.value.xAxis.categories = timeseries_data.categories;
        lineMonthlyByType.value.series = timeseries_data.series;


        //7. Timeseries by status 
       
        let timeseries_status =  processMonthlyStatus(AllSummary.byMonthStatus)
      //  console.log('timeseries_status',timeseries_status)

        lineMonthlyByStatus.value.xAxis.categories = timeseries_status.categories;
        lineMonthlyByStatus.value.series = timeseries_status.series;


        //8. resolution_rate
        let resolved_data = AllSummary.proportionStatus.find(item => item.status === "Resolved")
       
        // console.log('resolved_data',resolved_data.percentage)
        // resolution_rate.value= resolved_data.percentage;
        console.log(resolutionRateGauge.value)
        resolutionRateGauge.value.series[0].data=[resolved_data.percentage]

        //9. get Word Cloud
        //console.log('AllSummary.grievances',AllSummary.grievances)       

    } catch (error) {
        console.error('Error fetching summaries:', error);
    }
}

async function clearCharts() {
    try {
        console.log('Clear all data')
        selected_county=null
        selected_subcounty=null
        selected_ward=null

        open_grievances.value = null;
        resolved_grievances.value = null;
        escalated_grievances.value = null;
        total_grievances.value = null;
        per_change.value = {Open:0, Escalated:0, Resolved:0, Investigate:0, Total:0};
        
 

        MonthlyChartByGender.value.xAxis.categories = [];
        MonthlyChartByGender.value.series = [];

        MonthlyChartByLocation.value.xAxis.categories =  [];
        MonthlyChartByLocation.value.series = [];

        lineMonthlyByType.value.xAxis.categories =  [];
        lineMonthlyByType.value.series =  [];

        lineMonthlyByStatus.value.xAxis.categories =  [];
        lineMonthlyByStatus.value.series =  [];

         resolutionRateGauge.value.series[0].data =  [0];


    } catch (error) {
        console.error('Error nulllimng summaries:', error);
    }
}

onMounted(async () => {

   
 
      let county_data = await getAdminUnits('county')

      // Function to create an array of user objects
      county_data.forEach((county) => {
            counties.value.push({
                label: county.name +'('+county.code+')',
                value: county.name
            });
        });
        await fetchSummaries();
});


const subcounties =ref([])
const wards =ref([])
const selected_level=ref()

async function onSelectCounty() {

  await clearCharts()
  selected_level.value='county'
  filter_fields.value=['county']
  filter_values.value=[selected_county.value.toString()]

  // Get the subcounties 
  // Get subcouties 
  subcounties.value=[]
  let subcounty_data = await getFilterAdminUnits('subcounty', ['county'],[selected_county.value])

  // empty the subcounties 
  //
   // Function to create an array of user objects
   subcounty_data.forEach((subcounty) => {
            subcounties.value.push({
                label: subcounty.name,
                value: subcounty.name
            });
        });

    console.log('subcounty_data',subcounty_data)

  await fetchSummaries();

  

}

async function onSelectSUbCounty() {

await clearCharts()
selected_level.value='subcounty'
 
filter_fields.value=['subcounty']
filter_values.value=[selected_subcounty.value.toString()]

// Get the subcounties 
// Get subcouties 
wards.value=[]
let ward_data = await getFilterAdminUnits('ward', ['subcounty'],[selected_subcounty.value])

// empty the subcounties 
//
 // Function to create an array of user objects
 ward_data.forEach((ward) => {
          wards.value.push({
              label: ward.name,
              value: ward.name
          });
      });

  console.log('ward_data',ward_data)

await fetchSummaries();



}

async function onSelectWards() {

await clearCharts()
selected_level.value='ward'

filter_fields.value=['ward']
filter_values.value=[selected_ward.value.toString()]
 

await fetchSummaries();



}



async function onClearFilters() {

  // Clear Filters 
  console.log("Clear Filters")
    selected_county.value =null
    selected_subcounty.value=null
    selected_ward.value=null
    selected_level.value=null

  filter_fields.value=[]
  filter_values.value=[]
  await fetchSummaries();

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
async function getFilterAdminUnits(model,filterKeys,filterValues) {
  
  try {
    const response = await axios.post('/api/admin/units/filter', {
      model:model,
      filterKeys:filterKeys, 
      filterValues:filterValues
     });

     console.log('getFilterAdminUnits',response)

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

async function getAllSummary() {
  
  try {
    loading.value=true
    const response = await axios.post('/api/summary/all', {
      filter_fields:filter_fields.value,filter_values:filter_values.value
     });

 
    if (response.data.code === '0000') {
      //count[status] = response.data.data.length;
      console.log('Master Summary', response.data.result)
      loading.value=false
      return response.data.result
       
    }  
  } catch (error) {
    console.error('Error during login:', error.message);
    return null
    // Handle error, maybe show an error message to the user
  }
}


 
const resolutionRateGauge = ref({
        chart: {
            type: 'gauge',
            backgroundColor: 'transparent',
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'

        },
        title: {
            text: 'Resolution Rate',
            
        },
        
        pane: {
        startAngle: -90,
        endAngle: 89.9,
        background: null,
        center: ['50%', '75%'],
        size: '110%'
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 100,
        tickPixelInterval: 72,
        tickPosition: 'inside',
        tickColor:   '#FFFFFF',
        tickLength: 20,
        tickWidth: 2,
        minorTickInterval: null,
        labels: {
            distance: 20,
            style: {
                fontSize: '14px'
            }
        },
        lineWidth: 0,
        plotBands: [{
            from: 75,
            to: 100,
            color: '#55BF3B', // green
            thickness: 20,
            borderRadius: '50%'
        }, {
            from: 0,
            to: 25,
            color: '#DF5353', // red
            thickness: 20,
            borderRadius: '50%'
        }, {
            from: 25,
            to: 75,
            color: '#DDDF0D', // yellow
            thickness: 20
        }]
    },

    series: [{
        name: 'Rate',
        data: [0],
        tooltip: {
            valueSuffix: '%'
        },
        dataLabels: {
            format: '{y} %',
            borderWidth: 0,
            color:   '#333333',
            style: {
                fontSize: '16px'
            }
        },
        dial: {
            radius: '80%',
            backgroundColor: 'gray',
            baseWidth: 12,
            baseLength: '0%',
            rearLength: '0%'
        },
        pivot: {
            backgroundColor: 'gray',
            radius: 6
        }

    }]
    });

 const lineMonthlyByType = ref({
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',

        },
        title: {
            text: 'Monthly Grievances Cases Reported',
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
        series: [],
        lang: {
        noData: 'No Data'
    },
    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    }
    });

 
  const lineMonthlyByStatus = ref({
    chart: {
        type: 'column',
        backgroundColor: 'transparent',

    },
    title: {
        text: 'Monthly  Cases Reported by Status',
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
    series: [],
    lang: {
        noData: 'No Data'
    },
    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    }
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
    series: [],
    lang: {
        noData: 'No Data'
    },
    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    }
});


const MonthlyChartByLocation = ref({
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        zooming: {
            type: 'x',
            singleTouch: true
        }
    },
    title: {
        text: 'GRV Cases Reported by Location',
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
    series: [],
    lang: {
        noData: 'No Data'
    },
    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    }
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
