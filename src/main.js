import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './router.js'
import fetchReq from './plugins/fetchReq.js'
import elIcon from './plugins/el-icons.js'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

const plugins = [
    ElementPlus,
    router,
    [fetchReq, { port: 5005 }],
    elIcon
]

plugins.reduce((app, plugin) => plugin.constructor === Array ? app.use(...plugin) : app.use(plugin), app)

app.mount('#app')
