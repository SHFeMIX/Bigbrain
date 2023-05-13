<template>
    <el-page-header @back="$router.push(this.backPath)">
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

<script>
export default {
    props: ['backPath', 'title'],

    methods: {
        logout() {
            this.$fetchReq('admin/auth/logout', 'POST', null, localStorage.getItem('token'))
            localStorage.removeItem('token')
            this.$router.push('/login')
        }
    },

    beforeCreate() {
        if (!localStorage.getItem('token')) {
            this.$router.push('/login')
        }
    }

}
</script>