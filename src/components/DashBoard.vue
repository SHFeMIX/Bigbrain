<template>
    <TopBar backPath="/login" title="Dashboard"><el-button type="primary"
            @click="async () => { await $fetchReq('admin/quiz/new', 'POST', { name: 'newName' }); getGames() }">Create new
            game</el-button></TopBar>
    <div class="cardContainer">
        <el-card style="margin: 15px;" v-for="(val, index) in games" :key="val.id" shadow='hover'
            :body-style="{ padding: '0px', width: '200px' }">
            <img src="../assets/logo.png" style="width: 100%" />
            <el-divider style="margin: 0" />
            <div style="padding: 14px">
                <p>{{ val }}</p>


                <el-button type="default" size="large" style="width: 145px"><b>Start game</b></el-button>
                <br /><br />
                <el-button type="primary" @click="$router.push('/profile/' + index)">Edit</el-button>
                <el-popconfirm title="Are you sure to delete this game?"
                    @confirm="async () => { await $fetchReq('admin/quiz/' + val.id, 'DELETE'); getGames() }">
                    <template #reference>
                        <el-button type="danger">Delete</el-button>
                    </template>
                </el-popconfirm>

            </div>
        </el-card>
    </div>
</template>
  
<script>
import TopBar from './TopBar.vue'

export default {
    components: {
        TopBar
    },

    data() {
        return {
            games: null,
        }
    },

    methods: {
        async getGames() {
            const data = await this.$fetchReq('admin/quiz', 'GET')

            this.games = await Promise.all(data.quizzes.map(async (quiz) => {
                // if (id && id === quiz.id) {
                //     alert(`Join Link: http://localhost:3000/play/${quiz.active}, and has already copied to the clipboard`)
                //     navigator.clipboard.writeText(`http://localhost:3000/play/${quiz.active}`)
                // }
                const profile = await this.$fetchReq('admin/quiz/' + quiz.id, 'GET')
                profile.id = quiz.id
                return profile
            }))

            console.log(this.games)

        }
    },

    async mounted() {
        await this.getGames()
    }
};

</script>
  
<style>
.cardContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
}
</style>