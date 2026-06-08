<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formState = reactive({
  username: '',
  password: ''
});

function handleLogin() {
  authStore.login(formState.username);
  message.success(
    authStore.isAdmin
      ? '已登录为管理员，可管理工单。'
      : '已登录为普通用户，可查看工单和图表。'
  );
  router.push('/dashboard');
}
</script>

<template>
  <div class="login-page">
    <div class="login-shell">
      <section class="login-panel glass-card">
        <div class="form-heading">
          <p class="eyebrow">PC Work Order Dashboard</p>
          <h1>登录系统</h1>
          <p class="form-copy">输入用户名和密码后进入工单管理工作台。</p>
        </div>

        <a-form
          class="login-form"
          layout="vertical"
          :model="formState"
          @finish="handleLogin"
        >
          <a-form-item
            label="用户名"
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <a-input
              v-model:value="formState.username"
              size="large"
              placeholder="输入 admin 或任意用户名"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <a-input-password
              v-model:value="formState.password"
              size="large"
              placeholder="输入任意密码"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            class="login-button"
          >
            登录并进入工作台
          </a-button>
        </a-form>

        <a-alert
          class="login-tip"
          type="info"
          show-icon
          message="当前版本不做 token 持久化，刷新页面后会回到登录态。"
        />
      </section>

      <section class="tips-panel glass-card">
        <div class="tips-head">
          <p class="tips-title">登录说明</p>
          <p class="tips-copy">使用 `admin` 进入管理员视角，其他用户名进入普通用户视角。</p>
        </div>

        <div class="tips-list">
          <article class="tip-item">
            <span class="tip-badge admin-badge">管理员</span>
            <strong>用户名 `admin`</strong>
            <p>可查看、删除工单，并同步更新图表数据。</p>
          </article>

          <article class="tip-item">
            <span class="tip-badge user-badge">普通用户</span>
            <strong>任意其他用户名</strong>
            <p>仅可查看表格和图表，不显示删除入口。</p>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-shell {
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-panel {
  width: 100%;
  border-radius: 30px;
  padding: 40px 40px 34px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-strong);
}

.form-heading {
  margin-bottom: 30px;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 42px;
    letter-spacing: -0.04em;
  }
}

.form-copy {
  max-width: 420px;
  margin: 14px auto 0;
  color: var(--ink-soft);
  font-size: 15px;
  line-height: 1.7;
}

.login-form {
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}

.login-button {
  height: 48px;
  margin-top: 8px;
  border: none;
  background: linear-gradient(135deg, #dc5f33 0%, #f2b566 100%);
  box-shadow: 0 16px 26px rgba(220, 95, 51, 0.28);
}

.login-tip {
  width: 100%;
  max-width: 620px;
  margin: 20px auto 0;
  border-radius: 16px;
}

.tips-panel {
  width: 100%;
  margin-top: 18px;
  padding: 22px 24px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.64) 0%, rgba(255, 248, 241, 0.86) 100%);
}

.tips-head {
  text-align: center;
  margin-bottom: 18px;
}

.tips-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-strong);
}

.tips-copy {
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.7;
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.tip-item {
  border-radius: 20px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  text-align: left;

  strong {
    display: block;
    margin-bottom: 8px;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: var(--ink-soft);
    line-height: 1.7;
  }
}

.tip-badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  margin-bottom: 12px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.admin-badge {
  background: rgba(220, 95, 51, 0.14);
  color: var(--accent-strong);
}

.user-badge {
  background: rgba(124, 104, 86, 0.12);
  color: #735d4a;
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
}

:deep(.ant-input-affix-wrapper),
:deep(.ant-input) {
  border-radius: 14px;
}

@media (max-width: 768px) {
  .login-page {
    padding: 24px 16px;
  }

  .login-panel {
    padding: 30px 22px 24px;
  }

  .form-heading h1 {
    font-size: 34px;
  }

  .tips-panel {
    padding: 18px;
  }

  .tips-list {
    grid-template-columns: 1fr;
  }
}
</style>
