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
                            <VChart  :option="option" />
                          </client-only>

                        </SplitterPanel>
                        <SplitterResizeHandle id="splitter-group-1-resize-handle-1" class="w-2" />
                        <SplitterPanel id="splitter-group-1-panel-2" :min-size="20">
                          <SplitterGroup id="splitter-group-2" direction="vertical">
                            <SplitterPanel id="splitter-group-2-panel-1" :min-size="20"
                              class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
                              Panel B
                            </SplitterPanel>
                            <SplitterResizeHandle id="splitter-group-2-resize-handle-1" class="h-2" />
                            <SplitterPanel id="splitter-group-2-panel-2" :min-size="20"
                              class="bg-white dark:bg-transparent border rounded-xl flex items-center justify-center">
                              Panel C
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


</script>

<style scoped>
.chart {
  height: 90vh;
}
</style>