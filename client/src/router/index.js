import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Registration from '../components/Registration.vue'
import createTask from '@/components/createTask.vue'
import showProfile from '@/components/showProfile.vue'
import editProfile from '@/components/editProfile.vue'
import notFoundPage from '@/components/notFoundPage.vue'
import forgotPassword from '@/components/forgotPassword.vue'
import resetPassword from '@/components/resetPassword.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { requiresAuth: true },
    component: Dashboard
  },
  {
    path: '/createTask',
    name: 'createTask',
    component: createTask
  },
  {
    path: '/profile',
    name: 'showProfile',
    meta: { requiresAuth: true },
    component: showProfile
  },
  {
    path: '/editProfile',
    name: 'editProfile',
    meta: { requiresAuth: true },
    component: editProfile
  },
  {
    path: '/forgotPassword',
    name: 'forgotPassword',
    component: forgotPassword
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    meta: { requiresReset: true },
    component: resetPassword
  },
  {
    path: '*',
    name: 'notFoundPage',
    component: notFoundPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresReset)) {
    if (Object.keys(to.query).length === 2) {
      const enc = to.query.e;
      const res = to.query.r;
      if (enc && res) {
        if (atob(enc) == res) {
          next()
        } else {
          next({
            name: 'Registration'
          })
        }
      }
    } else {
      next({
        name: 'Registration'
      })
    }
  } else {
    next()
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.getLoggedIn) {
      next({
        name: 'Registration'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
