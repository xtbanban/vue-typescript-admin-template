import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/logging',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "logging" */ '@/views/logging/index.vue'),
        meta: {
          title: '接入情况',
          icon: 'table'
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/client',
    component: Layout,
    meta: {
      // roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "client" */ '@/views/client/index.vue'),
        meta: {
          title: '接入设备',
          icon: 'table',
          // roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    meta: {
      // roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "device" */ '@/views/device/index.vue'),
        meta: {
          title: '交换机',
          icon: 'table',
          // roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/setup',
    component: Layout,
    // meta: {
    //   roles: ['admin']
    // },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "logging" */ '@/views/setup/index.vue'),
        meta: {
          title: '设置',
          icon: 'table'
          // roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/logout',
    component: Layout,
    meta: {
      title: '退出',
      icon: 'link'
    }
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new VueRouter({
  mode: 'history', // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

export default router
