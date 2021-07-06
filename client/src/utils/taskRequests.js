import axios from 'axios'
import store from '../store/index'

const url = 'tasks'

class TaskService {

    // Create Task
    static async createTask(taskObj) {
        try {
            const resp = await axios.post(url, taskObj, { withCredentials: true })
            if (resp.status === 201) {
                return {
                    taskData: resp.data
                }
            }
        } catch (error) {
            return "Bad Request"
        }
    }

    // Get Tasks
    static async getTasks(queryObj) {
        let resp = {}
        let queryStr = `&page=${queryObj.pageNo}`
        if (queryObj.completed != undefined) {
            queryStr += `&completed=${queryObj.completed}`
        }
        try {
            resp = await axios.get(`${url}/?limit=6${queryStr}`, { withCredentials: true })
            if (resp.status === 200) {
                return {
                    taskData: resp.data
                }
            }
        } catch (error) {
            if (resp.status === 401 || Object.keys(resp).length == 0) {
                location.href = "/"
            }
            return "Bad Request"
        }
    }

    // Get Tasks
    static async getTotalTasks() {
        let resp = {}
        try {
            resp = await axios.get(`${url}/total`, { withCredentials: true })
            if (resp.status === 200) {
                store.dispatch('setTotalTasksCount', resp.data.length)
            }
        } catch (error) {
            if (resp.status === 401 || Object.keys(resp).length == 0) {
                location.href = "/"
            }
            return "Bad Request"
        }
    }
    // Delete Task
    static async deleteTask(id) {
        try {
            const resp = await axios.delete(`${url}/${id}`, { withCredentials: true })
            if (resp.status === 200) {
                return 'Success'
            }
        } catch (error) {
            return "Bad Request"
        }
    }

    // Edit Task
    static async updateTask({ id, description, completed }) {
        try {
            const resp = await axios.patch(`${url}/${id}`, { description, completed }, { withCredentials: true })
            if (resp.status === 200) {
                return 'Success'
            }
        } catch (error) {
            return "Bad Request"
        }
    }
}

export default TaskService
