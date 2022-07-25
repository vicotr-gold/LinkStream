import Vue from 'vue'
import Router from 'vue-router'
import store from '~/store'
import routes from './routes'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: routes,
})

router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load
    if (to.name) {
        // Start the route progress bar
        router.app.$Progress.start()
    }
    next()
})

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters['auth/isLoggedIn']()) {
            next()
        } else {
            next({ name: 'login' })
            store.dispatch('auth/logout')
        }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
        if (store.getters['auth/isLoggedIn']()) {
            next({ name: 'accountDashboard' })
            store.dispatch('me/loadAccount')
        } else {
            next()
        }
    } else {
        next()
    }
})

router.afterEach(() => {
    // store.dispatch('loading/reset')
    // Complete the animation of the route progress bar
    router.app.$Progress.finish()
})

export default router
