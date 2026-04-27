import { createRouter, createWebHistory } from 'vue-router'
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
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
  },
  {
    path: '/auth',
    component: () => import('@/components/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/components/Login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/components/Register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]
const frontendRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/components/FrontendLayout.vue'),
    children: [
      {
        path: "home",
        component: () => import('@/views/Home.vue')
      },
      {
        path: "knowledge",
        component: () => import('@/views/FrontendKnowledge.vue')
      },
      {
        path: "consultation",
        component: () => import('@/views/FrontendConsultation.vue')
      },
      {
        path: "emotion-diary",
        component: () => import('@/views/EmotionDiary.vue')
      },
      {
        path: "knowledge/article/:id",
        component: () => import('@/views/articleDetail.vue'),
        props: true
      },
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...backendRoutes, ...frontendRoutes],
})
// 导航前置守卫，检查登录状态
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  if (token) {
    // 已登录，根据用户类型判断是否需要重定向
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (userInfo && userInfo.userType == 2) {
        // 管理员，可以访问所有后台页面
        if (to.path.startsWith('/back')) {
          return true
        } else if (to.path.startsWith('/auth')) {
          // 管理员访问登录页，重定向到后台
          return '/back/dashboard'
        } else {
          return true
        }
      } else if (userInfo && userInfo.userType == 1) {
        // 普通用户，只能访问前台页面
        if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
          return '/'
        } else {
          return true
        }
      } else {
        // userType异常，重定向到登录页
        return '/auth/login'
      }
    } catch (e) {
      // userInfo解析失败，重定向到登录页
      return '/auth/login'
    }
  } else {
    // 未登录，根据路径判断是否需要重定向
    if (to.path.startsWith('/back')) {
      return '/auth/login'
    } else {
      // 前台页面，继续导航
      return true
    }
  }
})
export default router
