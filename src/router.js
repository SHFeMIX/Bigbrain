import { createRouter, createWebHistory } from 'vue-router'
import SignCom from './components/SignCom.vue'
import DashBoard from './components/DashBoard.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path : '/login', component: SignCom, props: { hasAccount: true } },
        { path : '/register', component: SignCom, props: { hasAccount: false } },

        { path: '/dashboard/:gameId(\\d+)?', component: DashBoard }
    ]
})
