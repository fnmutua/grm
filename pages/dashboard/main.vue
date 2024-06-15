<template>
  <LandingContainer>
    <div class="flex min-h-screen pt-10">
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
          <div class="w-full h-96 pt-4  text-green9 font-medium text-sm">
                      <SplitterGroup id="splitter-group-1" direction="horizontal">
                        <SplitterPanel id="splitter-group-1-panel-1" :min-size="20"
                          class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
 
                          <client-only>
                            <VChart  :option="hor_option" />

                          </client-only>

                        </SplitterPanel>
                        <SplitterResizeHandle id="splitter-group-1-resize-handle-1" class="w-2" />
                        <SplitterPanel id="splitter-group-1-panel-2" :min-size="20">
                          <SplitterGroup id="splitter-group-2" direction="vertical">
                            <SplitterPanel id="splitter-group-2-panel-1" :min-size="20"
                              class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
                              <client-only>
                                <VChart  :option="chart2_option" />
                              </client-only>
                            </SplitterPanel>
                            <SplitterResizeHandle id="splitter-group-2-resize-handle-1" class="h-2" />
                            <SplitterPanel id="splitter-group-2-panel-2"  
                              class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
                              <client-only>
                                <VChart  :option="option3" />
                              </client-only>
                            </SplitterPanel>
                          </SplitterGroup>
                        </SplitterPanel>
                      </SplitterGroup>
                    </div>
            



        </main>
      </div>
    </div>
  </LandingContainer>
</template>


<script setup>
definePageMeta({
  layout: "landing",
});

import { PieChart } from 'echarts/charts'
import * as echarts from 'echarts';

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ref } from 'vue'
import VChart from 'vue-echarts'
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])


const option = ref({
  title: {
    text: 'Traffic Sources',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    left: 'bottom',
    data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 234, name: 'Ad Networks' },
        { value: 135, name: 'Video Ads' },
        { value: 1548, name: 'Search Engines' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

const items = [{
  label: 'Maps',
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Charts',
  disabled: false,
  icon: 'i-heroicons-information-circle',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tables',
  icon: 'i-heroicons-information-circle',
  content: 'Finally, this is the content for Tab3'
}]


const colors = ['#5470C6', '#EE6666'];
const chart2_option = {
  color: colors,
  tooltip: {
    trigger: 'none',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {},
  grid: {
    top: 70,
    bottom: 50
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: colors[1]
        }
      },
      axisPointer: {
        label: {
          formatter: function (params) {
            return (
              'Precipitation  ' +
              params.value +
              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
            );
          }
        }
      },
      // prettier-ignore
      data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
    },
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: colors[0]
        }
      },
      axisPointer: {
        label: {
          formatter: function (params) {
            return (
              'Precipitation  ' +
              params.value +
              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
            );
          }
        }
      },
      // prettier-ignore
      data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Precipitation(2015)',
      type: 'line',
      xAxisIndex: 1,
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ]
    },
    {
      name: 'Precipitation(2016)',
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      data: [
        3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
      ]
    }
  ]
};

const option3 = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};

const hor_option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  series: [
    {
      name: 'Direct',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 302, 301, 334, 390, 330, 320]
    },
    {
      name: 'Mail Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Affiliate Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [150, 212, 201, 154, 190, 330, 410]
    },
    {
      name: 'Search Engine',
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: [820, 832, 901, 934, 1290, 1330, 1320]
    }
  ]
};


const time_option = {
  series: [
    {
      type: 'gauge',
      progress: {
        show: true,
        width: 18
      },
      axisLine: {
        lineStyle: {
          width: 18
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        length: 15,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 20
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        fontSize: 80,
        offsetCenter: [0, '70%']
      },
      data: [
        {
          value: 70
        }
      ]
    }
  ]
};
</script>

<style scoped>
.chart {
  height: 80vh;
}
</style>