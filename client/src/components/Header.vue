<template>
<div class="mainNav">
    <b-navbar class="container">
        <template slot="brand" >
            <b-navbar-item tag="router-link" to="/dashboard">
                <img
                    src="@/assets/tm1.jpg"
                    alt="Task Manager"
                >
                <h2>Task Manager</h2>
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item tag="router-link" to="/dashboard">
                Home
            </b-navbar-item>
            <b-navbar-item tag="router-link" to="/profile">
                My Profile
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <button @click="logOut()" class="button is-primary">
                        <strong>Log Out</strong>
                    </button>
                    <button @click="logOutAll()" class="button is-light">
                        Log Out of all devices
                    </button>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</div>
</template>

<script>
import UserService from '../utils/userRequests'

export default {
    methods: {
        async logOut() {
            this.$store.dispatch('setLoggedIn', false)
            await UserService.logout()
        },
        async logOutAll() {
            this.$store.dispatch('setLoggedIn', false)
            await UserService.logoutAll()
        },
    },
}
</script>

<style>
.navbar, .mainNav {
    background: rgb(18, 28, 61) !important;
}
a.navbar-item, .navbar-link {
    color: white !important;
}
a.navbar-item:hover, .navbar-link:hover {
    color: rgb(13, 19, 38) !important;
    /* background-color: sandybrown !important; */
}
.navbar-menu.is-active {
    background: rgb(17, 28, 61) !important;
}
.navbar-burger {
    background:  rgb(17, 28, 61) !important;
}
.navbar-burger span {
    background-color: white !important;
}
.navbar-burger {
    height: auto !important;
}
h2 {
    font-size: 30px !important;
    font-weight: 600 !important;
    margin-left: 10px !important;
    background: linear-gradient(to right, rgb(29, 75, 174), rgba(219, 71, 53, 0.85));
    /* background: -webkit-linear-gradient(white,green); */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.navbar-brand {
    background: white !important;
}
</style>