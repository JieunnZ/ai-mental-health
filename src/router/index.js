import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/back',
      component: () => import('@/components/BackendLayout.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: {
            title: '数据分析',
            icon: 'Clock'
          }
        },
        {
          path: 'knowledge',
          component: () => import('@/views/Knowledge.vue'),
          meta: {
            title: '知识文章',
            icon: 'ChatLineSquare'
          }
        },
        {
          path: 'consultations',
          component: () => import('@/views/Consultations.vue'),
          meta: {
            title: '咨询记录',
            icon: 'Message'
          }
        },
        {
          path: 'emotional',
          component: () => import('@/views/Emotional.vue'),
          meta: {
            title: '情绪日志',
            icon: 'User'
          }
        },
      ]
    }
  ],
})

export default router
