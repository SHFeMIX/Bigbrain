<template>
    <TopBar backPath="/login" title="Dashboard"><el-button type="primary" @click="showDrawer()">Create new game</el-button></TopBar>
    <div class="cardContainer">
        <el-card style="margin: 15px;" v-for="(val, index) in games" :key="val" shadow='hover'
            :body-style="{ padding: '0px', width: '200px' }">
            <img src="../assets/logo.png" style="width: 100%" />
            <el-divider style="margin: 0" />
            <div style="padding: 14px">
                <span>{{ val.title }}</span>
                <p>{{ val.description }}</p>


                <el-button type="success">Start game</el-button>
                <br /><br />
                <el-button type="primary" @click="showDrawer(index)">Edit</el-button>
                <el-popconfirm title="Are you sure to delete this game?" @confirm="this.games.splice(index, 1)">
                    <template #reference>
                        <el-button type="danger">Delete</el-button>
                    </template>
                </el-popconfirm>

            </div>
        </el-card>
    </div>


    <el-drawer v-model="drawer" direction="rtl" :before-close="beforeClose">
        <template #header>
            <h4>{{drawer_title}}</h4>
        </template>
        <template #default>
            <p>set content by slot</p>
        </template>
        <template #footer>
            <el-button type="primary" @click="submitDrawer()">confirm</el-button>
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
            games: [],
            drawer: false,
            drawer_title: null,
            currIndex: null
        }
    },

    watch: {
        drawer(val) {
            if (!val) {
                this.$router.push('/dashboard')
                this.currIndex = null
            }
            else {
                if (this.currIndex !== undefined) {
                    this.$router.push(`/dashboard/${this.currIndex}`)
                }
            }
            
        }
    },

    methods: {
        showDrawer(index) {
            if (index !== undefined) {
                this.drawer_title = `Edit ${this.games[index].title}`
            }
            else {
                this.drawer_title = 'Create new game'
            }

            this.currIndex = index
            this.drawer = true
        },

        beforeClose(done) {
            this.$confirm('Are you sure to close this? You will lose all unsaved changes.')
                .then(() => {
                    done()
                })
                .catch(() => {});
            
        },

        submitDrawer() {
            this.$message({
                type: 'success',
                message: this.drawer_title.split(' ')[0]  + ' successfully'
            });
            this.drawer = false
        },
    },

    mounted() {
        this.games = [
            {
                title: 'Game 1',
                description: 'This is game 1',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 2',
                description: 'This is game 2',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 3',
                description: 'This is game 3',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 4',
                description: 'This is game 4',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 5',
                description: 'This is game 5',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 6',
                description: 'This is game 6',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 7',
                description: 'This is game 7',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 8',
                description: 'This is game 8',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 9',
                description: 'This is game 9',
                img: '../assets/logo.png'
            },
            {
                title: 'Game 10',
                description: 'This is game 10',
                img: '../assets/logo.png'
            },
        ]

        if (this.$route.params.gameId) {
            this.currIndex = this.$route.params.gameId
            this.drawer_title = `Edit ${this.games[this.currIndex].title}`
            this.drawer = true
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