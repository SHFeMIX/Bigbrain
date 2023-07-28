<template>
    <!-- :model="formLabelAlign" -->
    <el-form label-position="top" label-width="100px" style="margin: 0 auto; width: 400px; margin-top: 60px">
        <el-form-item label="Email">
            <el-input v-model="formLabelAlign.email" />
        </el-form-item>
        <el-form-item label="Password">
            <el-input type="password" v-model="formLabelAlign.password" />
        </el-form-item>
        <el-form-item v-if="!hasAccount" el-form-item label="Name">
            <el-input v-model="formLabelAlign.name" />
        </el-form-item>
    </el-form>

    <el-button plain @click="change">{{ msg }}</el-button>
    <el-button type="primary" @click="submit">Enter</el-button>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useGlobalProperties from '../hooks/useGlobalProperties.js';

const $router = useRouter()
const $route = useRoute()

const $fetchReq = useGlobalProperties('$fetchReq')

const formLabelAlign = reactive({
    email: "",
    password: "",
    name: "",
})

const hasAccount = computed(() => $route.path === "/login")

const msg = computed(() => hasAccount.value ? "Don't have an account? Go register" : "Already have an account? Go login")

async function submit() {
    console.log(formLabelAlign);

    const data = await $fetchReq(`admin/auth/${hasAccount.value ? 'login' : 'register'}`, 'POST', formLabelAlign, null)
    if (data.error) {
        alert(data.error)
        return;
    }

    localStorage.setItem('token', data.token)
    $router.push("/dashboard");
}

function change() {
    $router.push({ path: hasAccount.value ? "/register" : "/login" });
}
</script>
