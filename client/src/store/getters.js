export default {
    getLoggedIn: state => {
        return state.loggedIn
    },
    getQueryObj: state => {
        return state.queryObj
    },
    getTotalTasks: state => {
        return state.totalTasksCount
    }
}
