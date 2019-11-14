import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/common/auth' // get token from cookie

const whiteList = ['/login', '/'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // set page title
  console.log('进入beforeEach')
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({to })
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('GetUserAuthorities')
          console.log(roles)
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('generateRoutes')

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('resetToken')
          Message.error(error || 'Has Error')
          next('/login')
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login')
    }
  }
})

router.afterEach(() => {
})
