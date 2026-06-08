<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

interface ChartItem {
  project: string;
  hours: number;
}

const props = defineProps<{
  data: ChartItem[];
}>();

const chartElement = ref<HTMLDivElement | null>(null);

let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

function renderChart() {
  if (!chart) {
    return;
  }

  if (!props.data.length) {
    chart.setOption(
      {
        title: {
          text: 'No Data',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#7c6856',
            fontSize: 18,
            fontWeight: 500
          }
        }
      },
      true
    );
    return;
  }

  chart.setOption(
    {
      backgroundColor: 'transparent',
      grid: {
        left: 18,
        right: 18,
        top: 68,
        bottom: 24,
        containLabel: true
      },
      title: {
        text: 'Project Hours Distribution',
        left: 18,
        top: 10,
        textStyle: {
          color: '#241e16',
          fontSize: 18,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: props.data.map((item) => item.project),
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(63, 42, 27, 0.18)'
          }
        },
        axisLabel: {
          color: '#58493d',
          interval: 0,
          rotate: props.data.length > 3 ? 12 : 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Hours',
        nameTextStyle: {
          color: '#7c6856'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(63, 42, 27, 0.08)'
          }
        },
        axisLabel: {
          color: '#7c6856'
        }
      },
      series: [
        {
          type: 'bar',
          data: props.data.map((item) => item.hours),
          barWidth: 38,
          itemStyle: {
            borderRadius: [12, 12, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#dc5f33' },
              { offset: 1, color: '#f2b566' }
            ])
          }
        }
      ]
    },
    true
  );
}

onMounted(() => {
  if (!chartElement.value) {
    return;
  }

  chart = echarts.init(chartElement.value);
  renderChart();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });

  resizeObserver.observe(chartElement.value);
});

watch(
  () => props.data,
  () => {
    renderChart();
  },
  {
    deep: true
  }
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<template>
  <div
    ref="chartElement"
    class="hours-chart"
  />
</template>

<style scoped lang="less">
.hours-chart {
  width: 100%;
  height: 360px;
}
</style>
