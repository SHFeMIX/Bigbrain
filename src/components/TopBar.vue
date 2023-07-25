<template>
    <el-page-header @back="$router.push(backPath)">
        <template #content>
            <div class="flex items-center">
                <el-avatar :size="32" class="mr-3"
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <span style="margin-right: 20px" class="text-large font-600 mr-3">{{ title }}</span>
                <slot/>
            </div>
        </template>
        <template #extra>
            <div class="flex items-center">
                <el-button type="warning" @click="logout">Logout</el-button>
            </div>
        </template>
    </el-page-header>
    <el-divider />
</template>

<script setup>
import { toRefs, getCurrentInstance } from 'vue'
import { useRouter} from 'vue-router'

const router = useRouter()
const Props = defineProps(['backPath', 'title'])
// defineProps不能套在函数里
const { backPath, title } = toRefs(Props)

// 使用自定义插件
const instance = getCurrentInstance();
const fetchReq = instance.appContext.config.globalProperties.$fetchReq;

function logout() {
    fetchReq('admin/auth/logout', 'POST', null, localStorage.getItem('token'))
    localStorage.removeItem('token')
    router.push('/login')
}

if (!localStorage.getItem('token')) {
    console.log('no token')
    router.push('/login')
}

</script>