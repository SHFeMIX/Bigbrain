<template>
    <el-form label-position="top" label-width="100px" :model="formLabelAlign" style="margin: 0 auto; width: 400px; margin-top: 60px">
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

<script>
export default {

    data() {
        return {
            hasAccount: null,
            formLabelAlign: {
                email: "",
                password: "",
                name: "",
            },
        };
    },

    computed: {
        msg() {
            return this.hasAccount? "Don't have an account? Go register" : "Already have an account? Go login";
        },
    },

    methods: {
        async submit() {
            console.log(this.formLabelAlign);

            const data = await this.$fetchReq(`admin/auth/${this.hasAccount ? 'login' : 'register'}`, 'POST', this.formLabelAlign, null)
            if (data.error) {
                alert(data.error)
                return;
            }

            localStorage.setItem('token', data.token)
            this.$router.push("/dashboard");
        },

        change() {
            this.$router.push({ path: this.hasAccount ? "/register" : "/login" });
            // console.log(this.$fetchReq)
        }
    },

    mounted() {
        this.hasAccount = this.$route.path === "/login";
    },
};
</script>
