<template>
    <section>
        <div class="fixed-action-btn">
            <b-tooltip label="Create Task" type="is-primary" position="is-left">
                <button @click="showModal()" class="btn-floating btn-large waves-effect waves-light red">
                <i class="fas fa-plus"></i></button>
            </b-tooltip>
        </div>
        <b-modal 
            class="animate__animated animate__flipInX"
            v-model="isComponentModalActive"
            has-modal-card
            full-screen 
            :can-cancel="false">
            <modal-form></modal-form>
        </b-modal>
    </section>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TaskService from '../utils/taskRequests'

    const ModalForm = {
        data() {
            return {
                description: '',
                password: '',
                completed: false,
                editor: ClassicEditor,
                editorConfig: {
                    // The configuration of the rich-text editor.
                }
            }
        },
        methods: {
            async createTask() {
                if(!this.description) {
                    return this.validationToast('Please make sure you enter the description')
                }
                const response = await TaskService.createTask({
                    description: this.description,
                    completed: this.completed
                })
                if(response == "Bad Request") {
                    return this.validationToast('Something went wrong')
                }
                if(response) {
                        this.$store.dispatch('setModal', false)
                        const response = await TaskService.getTasks({
                            pageNo: this.$store.getters.getQueryObj.pageNo
                        });
                        this.$store.dispatch('addTasks', response.taskData)
                        await TaskService.getTotalTasks()
                }
            },
            closeModal() {
                this.$store.dispatch('setModal', false)
            },
            validationToast(message) {
                this.$buefy.toast.open({
                    message,
                    type: 'is-danger',
                    duration: 3000
                })
            },
        },
        template: `
            <div id="customModal" class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Create</p>
                </header>
                <section class="modal-card-body">

                    <ckeditor :editor="editor" v-model="description" :config="editorConfig"></ckeditor>
                    <br>
                    <b-checkbox v-model="completed">Completed</b-checkbox>

                </section>
                <footer class="modal-card-foot">
                    <button class="button" type="button" @click="closeModal()">Close</button>
                    <button class="button is-primary" @click=createTask()>Save</button>
                </footer>
            </div>
        `
    }

    export default {
        components: {
            ModalForm
        },
        computed: {
            isComponentModalActive() {
                return this.$store.state.isComponentModalActive
            }
        },
        methods: {
            showModal() {
                this.$store.dispatch('setModal', true)
            }
        }
    }
</script>

<style scoped src="../../node_modules/materialize-css/dist/css/materialize.min.css"></style>
