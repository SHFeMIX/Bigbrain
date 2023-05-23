<template>
    <TopBar backPath="/dashboard" title="Game profile">
        <el-button type="primary" @click="showDrawer()">Add a question</el-button>
    </TopBar>

    <div v-if="questions" class="demo-collapse">
        <el-collapse>
            <el-collapse-item v-for="(q, i) in questions" :key="i">
                <template #title>
                    {{ q.question }}
                </template>


                <div style="borde: 1px solid red; text-align:left">
                    <el-divider style="margin: 0; margin-bottom: 10px"></el-divider>
                    <div v-for="(option, index) in q.options" :key="option">
                        <el-icon
                            :style="{ marginLeft: '10px', visibility: q.correctIndex.includes(index) ? 'visible' : 'hidden' }"><Select
                                title="green" /></el-icon>
                        <span style="left: 20px; position: relative">{{ option }}</span>
                    </div>

                    <br />
                    <el-button type="primary" @click.stop="showDrawer(i)">Edit</el-button>
                    <el-popconfirm title="Are you sure to delete this question?" @confirm="questions.splice(i, 1)">
                        <template #reference>
                            <el-button type="danger">Delete</el-button>
                        </template>
                    </el-popconfirm>
                </div>



            </el-collapse-item>
        </el-collapse>
    </div>

    <el-drawer v-model="drawer" direction="rtl" :before-close="beforeClose" size="50%">
        <template #header>
            <h4>{{ drawer_title }}</h4>
        </template>
        <template #default>
            <p>set content by slot</p>
            question: <el-input v-model="tempModelValue.question"></el-input>
            times: <el-input v-model="tempModelValue.questionTime"></el-input>
            options: <el-button type="primary" @click="tempModelValue.options.push('')">add</el-button><br />
            <template v-for="(val, index) in tempModelValue.options" :key="index">
                <el-input v-model="tempModelValue.options[index]"></el-input>
                <el-button type="warning" @click="tempModelValue.options.splice(index, 1)">delete</el-button>
            </template>
        </template>
        <template #footer>
            <el-button type="primary" @click="submitDrawer">confirm</el-button>
        </template>
    </el-drawer>
</template>
  
<script>
import TopBar from './TopBar.vue'

export default {
    components: {
        TopBar
    },

    data() {
        return {
            gameId: null,
            questions: null,
            drawer: false,
            drawer_title: null,
            currIndex: null,
            tempModelValue: null
        }
    },

    watch: {
        drawer(val) {
            if (val) {
                if (this.currIndex === undefined) {
                    this.tempModelValue = {
                        question: '',
                        questionTime: 20,
                        options: ['', '', '', ''],
                        correctIndex: []
                    }
                    this.drawer_title = 'Add a question'
                }
                else {
                    this.tempModelValue = JSON.parse(JSON.stringify(this.questions[this.currIndex]))
                    this.drawer_title = `Edit question ${this.currIndex + 1}`

                    this.$router.push(`/profile/${this.gameId}/edit/${this.currIndex}`)
                }
            }
            else {
                this.$router.push(`/profile/${this.gameId}`)
            }
        },

        questions: {
            handler(val) {
                console.log('questions changed')
                console.log(val)
                // 发给后端
            },
            deep: true
        }
    },

    methods: {
        showDrawer(index) {
            this.currIndex = index !== undefined ? parseInt(index) : index
            this.drawer = true
        },

        beforeClose(done) {
            this.$confirm('Are you sure to close this? You will lose all unsaved changes.')
                .then(() => {
                    done()
                })
                .catch(() => { });
        },

        submitDrawer() {
            this.$message({
                type: 'success',
                message: this.drawer_title.split(' ')[0] + ' successfully'
            });

            if (this.currIndex === undefined) {
                this.questions.push(this.tempModelValue)
            }
            else {
                this.questions[this.currIndex] = this.tempModelValue
            }

            this.drawer = false
        },
    },

    async mounted() {
        this.gameId = this.$route.params.gameId

        const data = await this.$fetchReq(`admin/quiz/${this.gameId}`, 'GET')
        this.questions = data.questions

        if (this.$route.params.questionId) {
            this.showDrawer(this.$route.params.questionId)
        }
    }
};

</script>
  
<spanstyle>
.cardContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
}
</spanstyle>