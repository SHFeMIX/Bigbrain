<template>
    <TopBar backPath="/login" title="Dashboard"><el-button type="primary" @click="dialogFormVisible = true">Create new
            game</el-button></TopBar>

    <div style="text-align: left">
        <h3>Current sessions</h3>
    </div>

    <el-table :data="Object.values(sessions)" empty-text="No session in progress" style="width: 100%">
        <el-table-column label="Session id" width="180" style="border: solid 1px red">
            <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                    <template #default>
                        <div style="display: flex; align-items: center">
                            <span style="margin-left: 10px">The link to join this game is {{ scope.row.id }}</span>
                        </div>
                    </template>
                    <template #reference>
                        <el-tag>{{ scope.row.id }}</el-tag>
                    </template>
                </el-popover>
            </template>
        </el-table-column>

        <el-table-column label="Game" width="180">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.quizName }}</span>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="Status" width="180">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.active ? 'Active' : 'Ended' }}</span>
                    <el-button size='small' type="primary" v-if="!scope.row.active">Check result</el-button>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="Position" width="180">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.position === -1 ? 'not started' : 'question ' +
                        (1 + scope.row.position) }}</span>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="Operations">
            <template #default="scope">
                <el-button :disabled="!scope.row.active" size="small" type='primary'
                    @click="advance(scope)">Advance</el-button>
                <el-button :disabled="!scope.row.active" size="small" type="danger"
                    @click="async () => { await $fetchReq('admin/quiz/' + scope.row.quizId + '/end', 'POST'); endSession(scope) }">End</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="cardContainer">
        <el-card style="margin: 15px;" v-for="val in games" :key="val.id" shadow='hover'
            :body-style="{ padding: '0px', width: '200px' }">
            <img src="../assets/logo.png" style="width: 100%" />
            <el-divider style="margin: 0" />
            <div style="padding: 14px">
                <div style="text-align: left; margin-left: 20px">
                    title: {{ val.name }} <br />
                    number of questions: {{ val.questions.length }} <br />
                    total time: {{ val.questions.length > 0 ? val.questions.reduce((acc, cur) => acc +
                        parseInt(cur.questionTime), 0) : 0 }}s <br />
                </div>
                <br />
                <el-button type="default" :disabled="val.active" size="large"
                    @click="async () => { await $fetchReq('admin/quiz/' + val.id + '/start', 'POST'); getGames(val.id) }"
                    style="width: 145px"><b>{{ val.active ? 'Be on' : 'Start game' }}</b></el-button>

                <br /><br />
                <el-button type="primary" @click="$router.push('/profile/' + val.id)">Edit</el-button>
                <el-popconfirm title="Are you sure to delete this game?"
                    @confirm="async () => { await $fetchReq('admin/quiz/' + val.id, 'DELETE'); getGames(); delete this.sessions[val.id] }">
                    <template #reference>
                        <el-button type="danger">Delete</el-button>
                    </template>
                </el-popconfirm>

            </div>
        </el-card>
    </div>

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
                    @click="async () => { dialogFormVisible = false; await $fetchReq('admin/quiz/new', 'POST', { name: this.newGameName }); getGames(); newGameName = '' }">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
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
            newGameName: '',
            sessions: {}
        }
    },

    methods: {
        async getGames(id) {
            const data = await this.$fetchReq('admin/quiz', 'GET')

            this.games = await Promise.all(data.quizzes.map(async (quiz) => {
                if (id && id === quiz.id) {
                    alert(quiz.active)
                }
                //     alert(`Join Link: http://localhost:3000/play/${quiz.active}, and has already copied to the clipboard`)
                //     navigator.clipboard.writeText(`http://localhost:3000/play/${quiz.active}`)
                // }

                if (quiz.active) {
                    let session = await this.$fetchReq('admin/session/' + quiz.active + '/status', 'GET')
                    session = session.results
                    session.quizId = quiz.id
                    session.id = quiz.active
                    session.quizName = quiz.name
                    this.sessions[quiz.id] = session
                }

                const profile = await this.$fetchReq('admin/quiz/' + quiz.id, 'GET')
                profile.id = quiz.id
                return profile
            }))
        },

        async advance(scope) {
            const data = await this.$fetchReq('admin/quiz/' + scope.row.quizId + '/advance', 'POST')
            const quiz = this.games.filter((game) => game.id === scope.row.quizId)[0]

            data.stage === quiz.questions.length ? this.endSession(scope) : this.getGames()
        },

        endSession(scope) {
            this.sessions[scope.row.quizId].active = false;
            this.getGames()
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