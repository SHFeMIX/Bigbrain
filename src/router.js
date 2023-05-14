import { createRouter, createWebHistory } from "vue-router";
import SignCom from "./components/SignCom.vue";
import DashBoard from "./components/DashBoard.vue";
import GameProfile from "./components/GameProfile.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: "/login" },
        { path: "/login", component: SignCom, props: { hasAccount: true } },
        { path: "/register", component: SignCom, props: { hasAccount: false } },

        { path: "/dashboard", component: DashBoard },

        { path: "/profile/:gameId(\\d+)", component: GameProfile },
        // 跳转过去不会重新渲染，因为是同一个组件，也就是不会触发mounted
        { path: "/profile/:gameId(\\d+)/edit/:questionId(\\d+)", component: GameProfile },
    ],
});
