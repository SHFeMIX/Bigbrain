<template>
    <TopBar backPath="/login" title="Dashboard"><el-button type="primary" @click="dialogFormVisible = true">Create new
            game</el-button></TopBar>
    <div class="cardContainer">
        <el-card style="margin: 15px;" v-for="val in games" :key="val.id" shadow='hover'
            :body-style="{ padding: '0px', width: '200px' }">
            <img src="../assets/logo.png" style="width: 100%" />
            <el-divider style="margin: 0" />
            <div style="padding: 14px">
                <div>
                    title: {{ val.name }} <br />
                    number of questions: {{ val.questions.length }} <br />
                    total time: {{ val.questions.length > 0 ? val.questions.reduce((acc, cur) => acc +
                        parseInt(cur.questionTime), 0) : 0 }}s <br />
                </div>
                <br />
                <el-button type="default" size="large" style="width: 145px"><b>Start game</b></el-button>
                <br /><br />
                <el-button type="primary" @click="$router.push('/profile/' + val.id)">Edit</el-button>
                <el-popconfirm title="Are you sure to delete this game?"
                    @confirm="async () => { await $fetchReq('admin/quiz/' + val.id, 'DELETE'); getGames() }">
                    <template #reference>
                        <el-button type="danger">Delete</el-button>
                    </template>
                </el-popconfirm>

            </div>
        </el-card>


        <el-dialog v-model="dialogFormVisible" center="true" title="Create new game" style="width: 30%; text-align:center">
            <el-form label-position="left" label-width="50px">
                <el-form-item el-form-item label="name">
                    <el-input v-model="newGameName" style="width: 200px" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span>
                    <el-button @click="dialogFormVisible = false">Cancel</el-button>
                    <el-button type="primary"
                        @click="async () => { dialogFormVisible = false; await $fetchReq('admin/quiz/new', 'POST', { name: this.newGameName }); getGames() }">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>

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
            dialogFormVisible: false,
            newGameName: ''
        }
    },

    watch: {
        dialogFormVisible() {
            this.newGameName = ''
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