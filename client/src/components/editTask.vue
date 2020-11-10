<template>
    <section>
        <b-modal 
        class="animate__animated animate__flipInX"
            v-model="isEditComponentModalActive"
            has-modal-card
            full-screen 
            :can-cancel="false">
            <modal-form :task="task"></modal-form>
        </b-modal>
    </section>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import TaskService from '../utils/taskRequests'

    const ModalForm = {
        props: ['task'],
        data() {
            return {
                editor: ClassicEditor,
                editorConfig: {
                    // The configuration of the rich-text editor.
                },
                description: '',
                completed: false
            }
        },
        methods: {
            async editTask(task) {
                if(!this.description) {
                    return this.validationToast('Please make sure you enter the description')
                }
                const response = await TaskService.updateTask({
                    id: task._id,
                    description: this.description,
                    completed: this.completed
                })
                if(response == "Bad Request") {
                    return this.validationToast('Something went wrong')
                }
                this.$store.dispatch('setEditModal', {
                    flag: false,
                    task: {}
                })
                 if(response === 'Success') {
                     const response = await TaskService.getTasks({
                        pageNo: this.$store.getters.getQueryObj.pageNo
                    });
                     this.$store.dispatch('addTasks', response.taskData)
                 }
            },
            closeModal() {
                this.$store.dispatch('setEditModal', {
                    flag: false,
                    task: {}
                })
            },
            prefill() {
               this.description = this.task.description
               this.completed = this.task.completed
            },  
            validationToast(message) {
                this.$buefy.toast.open({
                    message,
                    type: 'is-danger',
                    duration: 3000
                })
            },
            checkTags(val) {
                if(val) {
                    let reg =/<(.|\n)*?>/g; 

                    if (reg.test(val) == true) {
                        return this.validationToast('Tags are not allowed')
                    }
                }
            }
        },
        template: `
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Edit</p>
                </header>
                <section class="modal-card-body">
   
                    <ckeditor :editor="editor" v-model="description" :config="editorConfig" @ready="prefill"></ckeditor>
                    <br>
                    <b-checkbox v-model="completed">Completed</b-checkbox>

                </section>
                <footer class="modal-card-foot">
                    <button class="button" type="button" @click="closeModal()">Close</button>
                    <button class="button is-primary" @click=editTask(task)>Save</button>
                </footer>
            </div>
        `
    }

    export default {
        components: {
            ModalForm
        },
         computed: {
            isEditComponentModalActive() {
                return this.$store.state.isEditComponentModalActive
            },
            task() {
                return this.$store.state.editTask
            }
        },
    }
</script>

<style scoped src="../../node_modules/materialize-css/dist/css/materialize.min.css"></style>