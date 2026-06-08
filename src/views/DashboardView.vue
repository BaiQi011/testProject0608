<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { TableColumnsType } from 'ant-design-vue';
import { ExclamationCircleOutlined, LogoutOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import HoursChart from '@/components/HoursChart.vue';
import { useAuthStore } from '@/stores/auth';
import { useWorkOrderStore } from '@/stores/workOrder';
import type { WorkOrder } from '@/types/workOrder';

const router = useRouter();
const authStore = useAuthStore();
const workOrderStore = useWorkOrderStore();

const roleLabel = computed(() => (authStore.isAdmin ? '管理员' : '普通用户'));

const tableColumns = computed<TableColumnsType<WorkOrder>>(() => {
  const columns: TableColumnsType<WorkOrder> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 90
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project'
    },
    {
      title: 'Overtime',
      dataIndex: 'overtime',
      key: 'overtime',
      width: 120
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 100
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170
    }
  ];

  if (authStore.isAdmin) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 120
    });
  }

  return columns;
});

function handleDelete(id: string) {
  workOrderStore.deleteWorkOrder(id);
  message.success(`工单 ${id} 已删除，图表已同步更新。`);
}

function handleReset() {
  workOrderStore.resetWorkOrders();
  message.success('工单数据已恢复为初始 mock 数据。');
}

function handleLogout() {
  authStore.logout();
  message.info('已退出登录。');
  router.push('/login');
}
</script>

<template>
  <div class="dashboard-page">
    <header class="dashboard-header glass-card">
      <div>
        <p class="eyebrow">Workbench</p>
        <h1>工单管理工作台</h1>
        <p class="header-copy">
          登录用户：{{ authStore.username }}
          <a-tag color="orange">{{ roleLabel }}</a-tag>
        </p>
      </div>

      <div class="header-actions">
        <a-button
          size="large"
          class="secondary-button"
          @click="handleReset"
        >
          <template #icon>
            <ReloadOutlined />
          </template>
          重置数据
        </a-button>
        <a-button
          type="primary"
          size="large"
          class="logout-button"
          @click="handleLogout"
        >
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-button>
      </div>
    </header>

    <section class="stats-grid">
      <article class="stat-card glass-card">
        <span class="stat-label">工单总数</span>
        <strong>{{ workOrderStore.workOrders.length }}</strong>
        <p>当前展示的全部工单记录。</p>
      </article>

      <article class="stat-card glass-card">
        <span class="stat-label">累计工时</span>
        <strong>{{ workOrderStore.totalHours.toFixed(1) }}</strong>
        <p>按当前列表实时汇总，单位为小时。</p>
      </article>

      <article class="stat-card glass-card">
        <span class="stat-label">加班工单</span>
        <strong>{{ workOrderStore.overtimeCount }}</strong>
        <p>用于快速判断高强度项目占比。</p>
      </article>
    </section>

    <section class="dashboard-main">
      <article class="table-card glass-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Table</p>
            <h2>工单列表</h2>
          </div>
          <a-alert
            v-if="!authStore.isAdmin"
            type="warning"
            show-icon
            :message="'当前为普通用户，仅可查看数据。'"
          >
            <template #icon>
              <ExclamationCircleOutlined />
            </template>
          </a-alert>
        </div>

        <a-table
          :columns="tableColumns"
          :data-source="workOrderStore.workOrders"
          :pagination="false"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'overtime'">
              <a-tag :color="record.overtime ? 'green' : 'volcano'">
                {{ record.overtime ? 'Yes' : 'No' }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'hours'">
              {{ record.hours.toFixed(1) }}
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-popconfirm
                title="删除后图表会同步更新，确认继续吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button
                  type="link"
                  danger
                >
                  Delete
                </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </article>

      <article class="chart-card glass-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Chart</p>
            <h2>项目工时分布</h2>
          </div>
        </div>

        <HoursChart :data="workOrderStore.projectHoursData" />
      </article>
    </section>
  </div>
</template>

<style scoped lang="less">
.dashboard-page {
  min-height: 100vh;
  padding: 28px;
}

.dashboard-header,
.stat-card,
.table-card,
.chart-card {
  border-radius: 26px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding: 28px 30px;

  h1 {
    margin: 0;
    font-size: 42px;
    letter-spacing: -0.04em;
  }
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-strong);
}

.header-copy {
  margin: 12px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-soft);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.secondary-button,
.logout-button {
  height: 44px;
  padding: 0 18px;
  border-radius: 14px;
}

.secondary-button {
  border-color: rgba(36, 30, 22, 0.12);
  background: rgba(255, 255, 255, 0.7);
}

.logout-button {
  border: none;
  background: linear-gradient(135deg, #dc5f33 0%, #f2b566 100%);
  box-shadow: 0 16px 24px rgba(220, 95, 51, 0.26);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 24px;

  strong {
    display: block;
    margin-top: 16px;
    font-size: 42px;
    letter-spacing: -0.05em;
  }

  p {
    margin: 10px 0 0;
    color: var(--ink-soft);
    line-height: 1.7;
  }
}

.stat-label {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(220, 95, 51, 0.14);
  color: var(--accent-strong);
  font-size: 12px;
  font-weight: 700;
}

.dashboard-main {
  display: grid;
  grid-template-columns: minmax(700px, 1.35fr) minmax(420px, 0.85fr);
  gap: 24px;
  align-items: start;
}

.table-card,
.chart-card {
  padding: 24px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 28px;
    letter-spacing: -0.03em;
  }
}

:deep(.ant-table-wrapper) {
  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: rgba(242, 235, 224, 0.72);
    color: #4c392d;
    font-weight: 700;
  }

  .ant-table-tbody > tr > td {
    border-bottom-color: rgba(36, 30, 22, 0.08);
  }
}

@media (max-width: 1320px) {
  .dashboard-main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .dashboard-page {
    padding: 18px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;

    h1 {
      font-size: 34px;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
