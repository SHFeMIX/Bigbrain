<template>
    <TopBar backPath="/dashboard" title="Game profile">
        <el-button type="primary" @click="showDrawer()">Add a question</el-button>
    </TopBar>

    <div v-if="questions" class="demo-collapse">
        <el-collapse>
            <el-collapse-item v-for="(q, i) in questions" :key="i">
                <template #title>
                    {{ i + 1 }}. {{ q.question }}
                </template>

                <div style="borde: 1px solid red; text-align:left">
                    <el-divider style="margin: 0; margin-bottom: 10px"></el-divider>
                    <div v-for="(option, index) in q.options" :key="option">
                        <el-icon v-if="q.correctIndex.includes(index)" style="margin-left: 10px"><Select
                                title="green" /></el-icon>
                        <div v-else style="display: inline-block; width: 23px"></div>
                        <span style="left: 20px; position: relative">{{ option }}</span>
                    </div>

                    <br />
                    time limit: {{ q.questionTime }} seconds<br /><br />
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
            <h2>{{ drawer_title }}</h2>
        </template>
        <template #default>
            <el-form label-position="right" label-width="85px">
                <el-form-item label="question">
                    <el-input v-model="tempModelValue.question"></el-input>
                </el-form-item>
                <el-form-item label="time limit">
                    <el-slider v-model="tempModelValue.questionTime" show-input :min="20" :max="60" style="width: 600px" />
                </el-form-item>

                <br />
                <el-form-item label="options">
                    <el-button type="primary"
                        @click="tempModelValue.options.length < 6 ? tempModelValue.options.push('') : $message({ type: 'error', message: 'At most 6 options' })">add</el-button>
                </el-form-item>

                <el-form-item v-for="(option, index) in tempModelValue.options" :key="index" :label="index + 1"
                    style="borde: solid red 1px; display: flex">
                    <el-input v-model="tempModelValue.options[index]" style="width: 75%"></el-input>
                    <el-checkbox v-model="tempModelValue.correctIndex" :label="index"
                        style="margin-left: 20px; margin-right: 20px">correct</el-checkbox>
                    <el-button type="warning"
                        @click="tempModelValue.options.length > 4 ? tempModelValue.options.splice(index, 1) && deleteCorrect(index) : $message({ type: 'error', message: 'At least 4 options' })">delete</el-button>
                </el-form-item>

            </el-form>
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
                        questionTime: 30,
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
                this.$fetchReq(`admin/quiz/${this.gameId}`, 'PUT', { questions: val })
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

        deleteCorrect(no) {
            const index = this.tempModelValue.correctIndex.indexOf(no)

            if (index !== -1) {
                this.tempModelValue.correctIndex.splice(index, 1)
            }
        }
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