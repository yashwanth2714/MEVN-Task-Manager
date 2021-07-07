<template>
    <div>
        <Header />
        <div class="row" style="margin-top: 25px;">
            <div class="col s12 m4"></div>
            <div class="col s12 m4 animate__animated animate__zoomIn">
                <div class="card">
                    <div class="card-image">
                        <img v-if="!showDefault" :src="imgURL+'?'+getCount" style="height:300px">
                        <div v-show="showDefault" id="profileImage">
                            <span id="initials"></span>
                        </div>
                        <span class="card-title"
                            style="position: relative !important;color:black;top:10px">{{user.name}}</span>
                        <form :action="imgURL + 'me/avatar'" method="post" enctype="multipart/form-data">
                            <div class="uploadBtn">
                                <b-field class="file is-primary">
                                    <b-upload class="file-label" accept="image/*" v-model="file" name="avatar">
                                        <span class="file-cta">
                                            <i class="fas fa-upload"></i>
                                        </span>
                                    </b-upload>
                                </b-field>
                            </div>
                        </form>
                        <button v-if="!showDefault" class="btn-small btn-custom" @click="deleteProfileImage()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="card-content">
                        <p>{{user.email}}</p>
                        <div class="buttons card-buttons">
                            <button class="button is-primary editProfile" @click="$router.push('editProfile')">
                                <strong class="edit">Edit Profile</strong>
                            </button>
                            <button class="button deleteProfile" @click="deleteProfile()">
                                <strong>Delete Profile</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserService from '../utils/userRequests'
import Header from './Header'

export default {
    name: 'showProfile',
    components: {
        Header
    },
    data() {
        return {
            user: {},
            file: null,
            imgURL: '',
            showDefault: true,
            count: 1,
            initials: ''
        }
    },
    computed: {
        getCount() {
            return this.count
        }
    },
    watch: {
        file: {
            async handler(newVal) {
                if(newVal) {
                    if(newVal.size > 2000000) {
                        return this.validationToast('Image size is more than 2mb. Invalid!')
                    }
                    let formData = new FormData();
                    formData.append('avatar', newVal);
                    const response = await UserService.uploadAvatar(formData)
                    if(response === "Success") {
                        this.count += 1
                        this.readProfile()
                    } else {
                        return this.validationToast('Something went wrong')
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async readProfile() {
            const response = await UserService.viewProfile()
            if(response == "Bad Request") {
                return this.validationToast('Something went wrong')
            }
            if(response) {
                this.user = response.userData
                if("avatar" in this.user && this.user['avatar']) {
                    this.showDefault = false
                    this.imgURL = `${window.location.origin}/users/${this.user._id}/avatar`
                } else {
                    const firstName = this.user.name
                    this.initials = firstName.charAt(0);
                    document.getElementById("initials").innerText =  this.initials;
                }
            }
        },
        async deleteProfileImage() {
            if(this.user) {
                const response = await UserService.deleteAvatar()
                if(response == "Success") {
                    this.showDefault = true
                    document.getElementById("initials").innerText =  this.initials;
                } else {
                    return this.validationToast('Something went wrong')
                }
            }
        },
        async deleteProfile() {
            this.$buefy.dialog.confirm({
                    title: 'Deleting account',
                    message: 'Are you sure you want to <b>delete</b> your account? This action cannot be undone.',
                    confirmText: 'Delete Account',
                    type: 'is-danger',
                    hasIcon: false,
                    onConfirm: async () => {
                        if(this.user) {
                            const response = await UserService.deleteUserProfile()
                            if(response == "Success") {
                                this.$buefy.toast.open({
                                    message: 'Account deleted!',
                                    type: 'is-success'
                                })
                                this.$store.dispatch('setLoggedIn', false)
                                location.href = "/"
                            } else {
                                this.validationToast('Something went wrong')
                            }
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
    },
    created() {
        this.readProfile()
    },
}
</script>

<style scoped src="../../node_modules/materialize-css/dist/css/materialize.min.css"></style>
<style scoped>
    #profileImage {
        background: #512DA8;
        font-size: 35px;
        color: #fff;
        text-align: center;
        line-height: 150px;
        margin: 20px 0;
        height:300px;
    }
    .file-cta {
        /* background-color: tomato !important; */
        font-size: 15px !important;
    }
    .file-cta:hover {
        background-color: #20B2AA !important;
        transition: 0.5s;
    }
    .uploadBtn {
        position:absolute;
        top:10px;
        left: 10px;
    }
    .btn-custom {
        left: 10px;
        position: absolute;
        bottom: 40px;
        background: #F44336 !important;
    }
    .btn-custom:hover {
        background: white !important;
        transform: 0.5s;
    }
    .fa-trash {
        color: black;
    }
    .fa-trash:hover {
        color: #F44336;
        transition: 0.5s;
        transform: rotate(360deg);
    }
    #initials {
        /* position: absolute;
        top: 20% */
        vertical-align: middle;
        line-height: 300px;
    }
    .card-buttons {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
    .deleteProfile {
        background: tomato;
        color: white;
    }
    .deleteProfile:hover {
        background: white;
        color: tomato;
        box-shadow: 5px 5px 5px 0px tomato, 0px 0px 5px 0px tomato !important;
        border: white;
        transition: 0.5s ease;
    }
    .editProfile:hover {
        background: white !important;
        color: #20B2AA !important;
        box-shadow: 5px 5px 5px 0px #20B2AA, 0px 0px 5px 0px #20B2AA !important;
        transition: 0.5s;
    }
</style>
