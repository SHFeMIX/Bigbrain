<template>
    <el-page-header @back="$router.push(backPath)">
        <template #content>
            <div class="flex items-center">
                <el-avatar :size="32" class="mr-3"
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <span style="margin-right: 20px" class="text-large font-600 mr-3">{{ title }}</span>
                <slot />
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
import { toRefs } from 'vue'
// defineProps是编译器宏不需要导入的，然而eslint不认识非说not defined
// 随便从什么里导入一个哪怕是undefined，就能跑了
import { defineProps } from 'vue'
// 昨天提交的时候还好好的今天怎么eslint就报错
import { useRouter } from 'vue-router'
import useGlobalProperties from '../hooks/useGlobalProperties.js';

const $router = useRouter()

// 使用自定义插件
const $fetchReq = useGlobalProperties('$fetchReq')

// defineProps不能套在函数入参里
const Props = defineProps(['backPath', 'title'])
const { backPath, title } = toRefs(Props)

function logout() {
    $fetchReq('admin/auth/logout', 'POST', null, localStorage.getItem('token'))
    localStorage.removeItem('token')
    $router.push('/login')
}

if (!localStorage.getItem('token')) {
    console.log('no token')
    $router.push('/login')
}

</script>