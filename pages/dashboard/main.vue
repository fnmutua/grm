<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">
     

    <!-- Side Navigation for medium and larger screens -->
    <div  class="col-span-2 md:block">
      <AdminSideNav2></AdminSideNav2>
    </div>

    <!-- Main Content -->
    <div class="col-span-1 md:col-span-10 p-4">
      <div class="flex-1 flex flex-col">
        <main class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Grievances" value="89,935" change="10.2" icon="i-heroicons-megaphone"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Open Grievances" value="23,283.5" icon="i-heroicons-hand-thumb-up" change="3.1"
              changeType="increase" class="bg-white dark:bg-transparent border" />
            <StatCard title="Resolved Grievances" value="46,827" icon="i-heroicons-phone-arrow-down-left" change="2.56"
              changeType="decrease" class="bg-white dark:bg-transparent border" />
            <StatCard title="Escalated Grievances" value="124,854" icon="i-heroicons-hand-thumb-down" change="7.2"
              changeType="increase" class="bg-white dark:bg-transparent border" />
          </div>

          <UDivider label="**" class=" pt-4" />
          <div>
 
            <highchart :options="chartOpts3" more   :modules="['exporting']" class="bg-white dark:bg-transparent border"/>


          </div>
             <highchart :options="chartOpts2" more  :modules="['exporting']" />

         
 
        </main>
      </div>
      
            
          
    </div>
  </div>
   

     
</template>


 <script setup>
 definePageMeta({
   layout: "landing",
 });

 


 const chartOpts = {
  chart: {
    type: 'bubble',
    plotBorderWidth: 1,
    zoomType: 'xy'
  },

  legend: {
    enabled: false
  },

  title: {
    text: 'Sugar and fat intake per country'
  },

  subtitle: {
    text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
  },

  accessibility: {
    point: {
      valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.'
    }
  },

  xAxis: {
    gridLineWidth: 1,
    title: {
      text: 'Daily fat intake'
    },
    labels: {
      format: '{value} gr'
    },
    plotLines: [{
      color: 'black',
      dashStyle: 'dot',
      width: 2,
      value: 65,
      label: {
        rotation: 0,
        y: 15,
        style: {
          fontStyle: 'italic'
        },
        text: 'Safe fat intake 65g/day'
      },
      zIndex: 3
    }],
    accessibility: {
      rangeDescription: 'Range: 60 to 100 grams.'
    }
  },

  yAxis: {
    startOnTick: false,
    endOnTick: false,
    title: {
      text: 'Daily sugar intake'
    },
    labels: {
      format: '{value} gr'
    },
    maxPadding: 0.2,
    plotLines: [{
      color: 'black',
      dashStyle: 'dot',
      width: 2,
      value: 50,
      label: {
        align: 'right',
        style: {
          fontStyle: 'italic'
        },
        text: 'Safe sugar intake 50g/day',
        x: -10
      },
      zIndex: 3
    }],
    accessibility: {
      rangeDescription: 'Range: 0 to 160 grams.'
    }
  },

  tooltip: {
    useHTML: true,
    headerFormat: '<table>',
    pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
            '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
            '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
            '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
    footerFormat: '</table>',
    followPointer: true
  },

  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    }
  },

  series: [{
    data: [
      { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
      { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
      { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
      { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
      { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
      { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
      { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
      { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
      { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
      { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
      { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
      { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
      { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
      { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
      { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
    ]
  }]

}
const chartOpts2 = {
 
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
      color:'pink', 
      data: [59, 83, 65, 228, 184]
  }, {
      type: 'column',
      name: 'Other',
      color:'blue', 
      data: [24, 79, 72, 240, 167]
  },   {
      type: 'pie',
      name: 'Cases',
      data: [{
          name: 'GBV',
          y: 619,
          color:'pink',
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
          color:'blue'
       } ],
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
      backgroundColor: '#202d3b'
  },
  title: {
      text: 'Grievances by gender',
      align: 'left'
  },
  xAxis: {
      categories: ['2020', '2021', '2022', '2023' ]
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
      backgroundColor:  'white',
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
      color:'blue',
      data: [3, 5, 1, 13]
  }, {
      name: 'Female',
      color:'pink',

      data: [14, 8, 8, 12]
  } ],
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

