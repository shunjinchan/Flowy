import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: require('@/components/IndexPage/Board').default,
      children: [
        {
          path: ':id',
          component: require('@/components/IndexPage/Board').default
        }
      ]
    },
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    }
  ]
})
