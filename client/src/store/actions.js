export default {
    addTasks: (context, payload) => {
        context.commit('addTasks', payload)
    },
    setModal: ({commit}, payload) => {
        commit('setModal', payload)
    },
    setEditModal: ({commit}, payload) => {
        commit('setEditModal', payload)
    },
    setTaskModal: ({commit}, payload) => {
        commit('setTaskModal', payload)
    },
    setLoggedIn: ({commit}, payload) => {
        commit('setLoggedIn', payload)
    },
    setQueryObjToTasks: ({commit}, payload) => {
        commit('setQueryObjToTasks', payload)
    },
    setTotalTasksCount: ({commit}, payload) => {
        commit('setTotalTasksCount', payload)
    },
}