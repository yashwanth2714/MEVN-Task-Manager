<template>
  <div class="mainBg">
      <div class="container is-flex container-custom">
        <component :is="component.name"></component>
      </div>
  </div>
</template>


<script>

import {bus} from '../main.js'
import Login from '@/components/LoginPage.vue'
import Signup from '@/components/SignupPage.vue'

export default {
  name: 'Registration',
  data() {
      return {
          component: {
              name: 'Login'
          }
      }
  },
  components: {
      Login,
      Signup
  },
  mounted() {
    bus.$on('selectedComp', data => {
        this.component.name= data
    })   
  },
  created() {
    if(this.$store.getters.getLoggedIn)
      this.$store.dispatch('setLoggedIn', false)
  }
}
</script>

<style scoped>
.mainBg {
  background: linear-gradient(to right, rgb(29, 75, 174), rgba(219, 71, 53, 0.85))
}
.container-custom {
    min-height: 100vh;
    justify-content: center;
    align-items: center;
}
.card-custom {
  display: flex;
  flex-direction: column;
}
.button-custom {
  background-color: rgb(255, 76, 76) !important;
  margin-top: 25px;
}
h3 {
  font-size: 25px;
  line-height: 3;
  font-weight: 600;
}
h4 {
  font-weight: 500;
  margin-top: 25px;
}
a:hover {
    color: rgb(255, 76, 76) !important;
}
</style>
