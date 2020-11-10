export default {
    addTasks: (state, payload) => {
        state.tasks = payload
    },
    setModal: (state, payload) => {
        state.isComponentModalActive = payload
    },
    setEditModal: (state, payload) => {
        state.isEditComponentModalActive = payload.flag
        state.editTask = payload.task
    },
    setTaskModal: (state, payload) => {
        state.open = payload.flag
        state.taskDescription = payload.taskDescription
    },
    setLoggedIn: (state, payload) => {
        state.loggedIn = payload
    },
    setQueryObjToTasks: (state, payload) => {
        state.queryObj.pageNo = payload.currentPage
    },
    setTotalTasksCount: (state, payload) => {
        state.totalTasksCount = payload
    },
}