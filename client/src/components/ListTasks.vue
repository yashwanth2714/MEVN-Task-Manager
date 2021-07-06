<template>
    <div>       
        <div class="row" v-show="tasks.length">
            <template>
                <div v-for="task in tasks" :key="task.id" class="animate__animated">
                <div class="col s12 m4 animate__animated animate__backInLeft">
                    <div class="card  darken-1">
                        <div class="card-content black-text card-text">
                        <span class="card-title title-date" >
                            <span class="formatDate">{{task.updatedAt | moment("MMM Do YYYY, h:mm a")}}</span>
                            <span v-if="task.completed">
                                <b-tooltip label="Completed"  type="is-primary">
                                    <i class="fas fa-check"></i>
                                </b-tooltip>
                            </span>
                            <span v-if="!task.completed">
                                <b-tooltip label="Incompleted"  type="is-danger">
                                    <i class="fas fa-times"></i>
                                </b-tooltip>
                            </span>
                        </span>
                            <p>{{task.description |removeSpaces | stripTags | truncate(30)}}</p>
                        </div>
                        <div class="card-action card-custom">
                        <a href="#" class="btn grey" @click="showTaskModal(task.description)">Read more</a>
                        <span>
                            <button @click="showEditTask(task)" class="btn btn-float btn-custom">
                                <i class="fas fa-edit"></i>
                            </button>

                            <div class="delete-form">
                                <input type="hidden" name="_method" value="DELETE">
                                <button type="submit" class="btn red btn-custom" @click="removeTask(task._id)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
                </div>
            </template>
    </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import TaskService from '../utils/taskRequests'

export default {
    name: 'ListTasks',
    props: ['currentPageNo'],
    computed: {
        ...mapState([
                'tasks'
        ]),
    },
    methods: {
        async retrieveTasks() {
            const response = await TaskService.getTasks({
                pageNo: this.$store.getters.getQueryObj.pageNo
            });
            if(response == "Bad Request") {
                return this.validationToast('Unable to fetch tasks')
            }
            this.$store.dispatch('addTasks', response.taskData)
            await TaskService.getTotalTasks()
        },
        async removeTask(id) {
            this.$buefy.dialog.confirm({
                    title: 'Deleting Task',
                    message: 'Are you sure you want to <b>delete</b> this task? This action cannot be undone.',
                    confirmText: 'Delete Task',
                    type: 'is-danger',
                    hasIcon: false,
                    onConfirm: async () => {
                        const response = await TaskService.deleteTask(id)
                        if(response === 'Success') {
                            this.$buefy.toast.open({
                                message: 'Task deleted!',
                                type: 'is-success'
                            })
                            const filteredTasks = this.tasks.filter(task => task._id !== id)
                            this.$store.dispatch('addTasks', filteredTasks)
                            await TaskService.getTotalTasks()
                            this.retrieveTasks()
                        } else {
                            this.validationToast('Something went wrong')
                        }
                    }
                })
        },
            validationToast(message) {
            this.$buefy.toast.open({
                message,
                type: 'is-danger',
                duration: 3000
            })
        },
        showEditTask(task) {
            this.$store.dispatch('setEditModal', {
                flag: true,
                task
            })
        },
        showTaskModal(taskDescription) {
            this.$store.dispatch('setTaskModal', {
                flag: true,
                taskDescription
            })
        }
    },
    mounted() {
        this.retrieveTasks()
    },
    watch: {
        currentPageNo: {
            handler() {
                this.retrieveTasks()
            }
        }
    },
}
</script>

<style scoped src="../../node_modules/materialize-css/dist/css/materialize.min.css"></style>

<style scoped>
.btn-custom {
    padding: 0px 7px !important;
    line-height: 34px !important;
}

.card-text {
    font-family: medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif;
	font-size: 21px;
	font-style: normal;
	font-variant: normal;
	font-weight: 400;
	letter-spacing: -0.063px;
	line-height: 32px;
	text-decoration: none solid rgb(41, 41, 41);
	text-align: start;
	text-indent: 0px;
	text-transform: none;
	vertical-align: baseline;
	white-space: normal;
	word-spacing: 0px;
}

.formatDate {
    font-family: Cambria, "Times New Roman", Times, serif;
    font-size: 14px;
}

.title-date {
    display: flex !important;
    flex-flow: row wrap;
    justify-content: space-between;
}

.card-custom {
    display: flex !important;
    flex-flow: row wrap;
    justify-content: space-between;
}

.delete-form {
    float: right;
    margin-left: 10px;
}
.card:hover {
    box-shadow: 0px 0px 15px 0px tomato, 0px 0px 15px 0px tomato !important;
    transition: 0.5s ease-in-out;
}
</style>
