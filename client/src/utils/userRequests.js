import axios from 'axios'

const url = 'users'

class UserService {

    // Create User
    static async createUser(userObj) {
        try {
            const resp =  await axios.post(url, userObj, {withCredentials: true})   
            if(resp.status === 201) {
                return {
                    userData: resp.data
                } 
            }
        } catch (error) {
            return "Bad Request"
        }
    }

    // Login User
    static async loginUser(userObj) {
        try {
            const resp =  await axios.post(`${url}/login`, userObj, {withCredentials: true})   
            if(resp.status === 200) {
                return {
                    userData: resp.data
                }   
            }
        } catch (error) {
            return "Bad Request"
        }
    }

    //Logout User
    static async logout() {
        try {
            const resp = await axios.post(`${url}/logout`, 'ntng',{withCredentials: true})
            if(resp.status === 200) {
                location.href = "/"
            }
        } catch (error) {
            return "500 Server Error"
        }
    }

     // Logout from all devices
     static async logoutAll() {
        try {
            const resp =  await axios.post(`${url}/logoutAll`, 'ntng', {withCredentials: true})   
            if(resp.status === 200) {
                location.href = "/"
            }
        } catch (error) {
            return "500 Server Error"
        }
    }

    // Show Profile
    static async viewProfile() {
        let resp = {}
        try {
            resp = await axios.get(`${url}/me`, {withCredentials: true})
            if(resp.status === 200) {
                return {
                    userData: resp.data
                }
            }
        } catch (error) {
            if(resp.status === 401 || Object.keys(resp).length == 0) {
                return location.href = "/"
            }
            return "Bad Request"
        }
    }

    // Upload Profile Image
    static async uploadAvatar(file) {
        try {
            const resp = await axios.post(`${url}/me/avatar`, file,{withCredentials: true})
            if(resp.status === 200) {
                return "Success"
            }
        } catch (error) {
            return "500 Server Error"
        }
    }

    // Delete Profile Image
    static async deleteAvatar() {
        try {
            const resp = await axios.delete(`${url}/me/avatar`, {withCredentials: true})
            if(resp.status === 200) {
                return "Success"
            }
        } catch (error) {
            return "500 Server Error"
        }
    }

    // Delete Profile 
    static async deleteUserProfile() {
        try {
            const resp = await axios.delete(`${url}/me`, {withCredentials: true})
            if(resp.status === 200) {
                return "Success"
            }
        } catch (error) {
            return "500 Server Error"
        }
    }

    // Update User Profile
    static async updateProfile(userObj) {
        let resp = {};
        try {
            resp = await axios.patch(`${url}/me`, userObj, {withCredentials: true})
            if(resp.status == 200) {
                return "Success"
            }
            if(resp.status == 208) {
                return "Exists"
            }
        } catch (error) {
            return "Bad Request"
        }
    }

    // Forgot Password
    static async forgot(userEmail) {
        let resp = {};
        try {
            resp = await axios.post(`${url}/forgot`, {email: userEmail})
            if(resp.status == 200 && resp.data == "Success") {
                return "Success"
            }
        } catch (error) {
            return "Bad Request"
        }
    }
    
    // Update User Password
    static async saveNewpassword(userObj) {
        let resp = {};
        try {
            resp = await axios.patch(`${url}/me/pwd`, userObj)
            if(resp.status == 200) {
                return "Success"
            }
        } catch (error) {
            return "Bad Request"
        }
    }
}

export default UserService