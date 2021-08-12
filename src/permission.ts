import router, { resetRouter } from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/logout']

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  // Determine whether the user has logged in
  if (UserModule.token) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else if (to.path === '/logout') {
      // 重置注册的路由导航map，主要是为了通过addRoutes方法动态注入新路由时，避免重复注册相同name路由
      resetRouter()
      // If is logout, redirect to the home page
      UserModule.ResetToken()
      next('/login')
    } else {
      // Check whether the user has obtained his permission roles
      if (UserModule.roles.length === 0) {
        try {
          // Get user info, including roles
          await UserModule.GetUserInfo()
          const roles: string[] = UserModule.roles
          // Generate accessible routes map based on role
          PermissionModule.GenerateRoutes(roles)
          // Dynamically add accessible routes
          // router.addRoutes(PermissionModule.dynamicRoutes) // router.addRoutes 已废弃：使用 router.addRoute() 代替。
          resetRouter()
          PermissionModule.dynamicRoutes.forEach(route => {
            router.addRoute(route)
          })
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (err) {
          // Remove token and redirect to login page
          UserModule.ResetToken()
          Message.error(err || '出错了')
          next(`/login`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()
  // set page title
  if (to.meta.title == undefined) {
    document.title = 'RadiusServer'
  } else {
    document.title = to.meta.title + ' | RadiusServer'
  }
})
