import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { WorkOrder } from '@/types/workOrder';

const initialWorkOrders: WorkOrder[] = [
  {
    id: '001',
    project: 'Road Project A',
    overtime: true,
    hours: 3.5,
    createdAt: '2024-04-10 10:30'
  },
  {
    id: '002',
    project: 'Bridge Maintenance B',
    overtime: false,
    hours: 2,
    createdAt: '2024-04-09 13:00'
  },
  {
    id: '003',
    project: 'Pipeline Fix C',
    overtime: true,
    hours: 4.5,
    createdAt: '2024-04-08 08:00'
  },
  {
    id: '004',
    project: 'Bridge Maintenance B',
    overtime: true,
    hours: 3,
    createdAt: '2024-04-07 16:45'
  },
  {
    id: '005',
    project: 'Tunnel Cleaning D',
    overtime: false,
    hours: 8.1,
    createdAt: '2024-04-03 11:43'
  }
];

export const useWorkOrderStore = defineStore('work-order', () => {
  const workOrders = ref<WorkOrder[]>([...initialWorkOrders]);

  const totalHours = computed(() =>
    workOrders.value.reduce((sum, item) => sum + item.hours, 0)
  );

  const overtimeCount = computed(
    () => workOrders.value.filter((item) => item.overtime).length
  );

  const projectHoursData = computed(() => {
    const groupedHours = workOrders.value.reduce<Record<string, number>>((acc, item) => {
      acc[item.project] = (acc[item.project] ?? 0) + item.hours;
      return acc;
    }, {});

    return Object.entries(groupedHours)
      .map(([project, hours]) => ({
        project,
        hours: Number(hours.toFixed(1))
      }))
      .sort((a, b) => b.hours - a.hours);
  });

  function deleteWorkOrder(id: string) {
    workOrders.value = workOrders.value.filter((item) => item.id !== id);
  }

  function resetWorkOrders() {
    workOrders.value = [...initialWorkOrders];
  }

  return {
    workOrders,
    totalHours,
    overtimeCount,
    projectHoursData,
    deleteWorkOrder,
    resetWorkOrders
  };
});
