<template>
<div class="mainBg">
        <Header />
        <div class="container" style="margin-top: 50px !important;">
            <ListTasks :currentPageNo="current"/>
            <div class="paddingButton" style="padding-top: 70px;">
                 <createTask />
            </div>
            <div class="customPagination" v-if="totalTasks >= 6">
              <section>
                    <b-pagination
                    class="customPage"
                            :total="totalTasks"
                            v-model="current"
                            :range-before="rangeBefore"
                            :range-after="rangeAfter"
                            :order="order"
                            :size="size"
                            :simple="isSimple"
                            :rounded="isRounded"
                            :per-page="perPage"
                            >
                        </b-pagination>
                </section>
            </div>
            <editTask />
            <showTask />
        </div>
</div>
</template>

<script>
import Header from './Header'
import ListTasks from './ListTasks'
import createTask from './createTask'
import editTask from './editTask'
import showTask from './showTask'

export default {
    components: {
        Header,
        ListTasks,
        createTask,
        editTask,
        showTask
    },
    data() {
            return {
                total: 0,
                current: 1,
                perPage: 6,
                rangeBefore: 1,
                rangeAfter: 1,
                order: 'is-centered',
                size: 'is-small',
                isSimple: false,
                isRounded: false
            }
        },  
    computed: {
        totalTasks() {
            return this.$store.getters.getTotalTasks
        }
    },
    watch: {
        current: {
            handler(newVal) {
                this.$store.dispatch('setQueryObjToTasks', {
                    currentPage: newVal
                })
            },
            immediate: true
        }
    }
}
</script>

<style>
.pagination-link {
    color: white !important;
    font-weight: bold;
}
.pagination-previous, .pagination-next {
    opacity: 0 !important;
    display: none !important;
}
.customPagination {
    position: fixed;
    bottom: 50px;
    left: 20%;
}
@media only screen and (max-width: 600px) {
    .customPagination {
        position: absolute !important;
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
    .customPagination {
        position: fixed !important;
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .customPagination {
        position: fixed !important;
    }
} 
</style>