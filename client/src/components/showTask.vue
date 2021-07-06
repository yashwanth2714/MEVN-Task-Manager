<template>
    <div>
        <!-- Modal Structure -->
        <div :class="['modal', open ? 'open' : '']" :style="[open ? modalStyle: '']" class="animate__animated animate__bounceIn">
            <div class="modal-footer">
                <div class="btn red btn-float" @click="closeModal()"><b>X</b></div>
            </div>
            <div class="modal-content">
            <p v-html="taskDescription"></p>
            </div>
        </div>
    </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js"></script>

<script>
export default {
    data() {
        return {
            modalStyle: {
                'z-index': 1003,
                'display': 'block', 
                'opacity': 1,
                'transform': 'scaleX(1); top: 10%'
            }
        }
    },
    computed: {
        open() {
            return this.$store.state.open
        },
        taskDescription() {
            return this.$store.state.taskDescription
        }
    },
    methods: {
        closeModal() {
            this.$store.dispatch('setTaskModal', {
                    flag: false,
                    taskDescription: ''
                })
        }
    }
}
</script>

<style scoped src="../../node_modules/materialize-css/dist/css/materialize.min.css"></style>

<style scoped>
.modal {
    max-height: 35% !important;
}
</style>
