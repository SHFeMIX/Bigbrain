<template>
    <TopBar backPath="/dashboard" title="Dashboard"><el-button type="primary" @click="showDrawer()">Add a
            question</el-button>
    </TopBar>

    <div v-for="(question, index) in questions" :key="question">
        {{ question }}
        <el-button type="primary" @click="showDrawer(parseInt(index))">Edit</el-button>
        <el-popconfirm title="Are you sure to delete this question?" @confirm="this.questions.splice(index, 1)">
            <template #reference>
                <el-button type="danger">Delete</el-button>
            </template>
        </el-popconfirm>
    </div>

    <el-drawer v-model="drawer" direction="rtl" :before-close="beforeClose">
        <template #header>
            <h4>{{ drawer_title }}</h4>
        </template>
        <template #default>
            <p>set content by slot</p>
            {{ tempModelValue }}
            title: <el-input v-model="tempModelValue.question" />
            description: <el-input v-model="tempModelValue.answer" />
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
            questions: [],
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
                        answer: ''
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
                console.log(val)
                // 发给后端
            },
            deep: true
        }
    },

    methods: {
        showDrawer(index) {
            this.currIndex = index
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

    mounted() {
        console.log('aaaaaaa')
        this.gameId = this.$route.params.gameId

        this.questions = [
            {
                question: 'question 1',
                answer: 'answer 1'
            },
            {
                question: 'question 2',
                answer: 'answer 2'
            },
            {
                question: 'question 3',
                answer: 'answer 3'
            },
            {
                question: 'question 4',
                answer: 'answer 4'
            }
        ]

        if (this.$route.params.questionId) {
            this.showDrawer(this.$route.params.questionId)
        }
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