<template>
  <div class="card animate__animated animate__rotateInDownRight">
    <div class="card-content card-custom">
      <h3>Login Here</h3>
        <section>
          <b-field>
              <b-input placeholder="Email"
                  size="is-medium"
                  type="email"
                  icon-pack="fas"
                  icon="envelope"
                  v-model="email"
                  required>
              </b-input>
          </b-field>
          <b-field>
              <b-input type="password"
                  size="is-medium"
                  placeholder="Password"
                  password-reveal
                  icon-pack="fas"
                  icon="key"
                  v-model="password"
                  required>
              </b-input>
          </b-field>
        </section>
        <h4>
          <router-link to="/forgotPassword">Forgot Password..?</router-link>
        </h4>
        <div style="text-align:center">
          <b-button type="is-link" class="button-custom" expanded @click="login()">Login</b-button>
        </div>
        <h4 style="text-align: center;">Don't have an account..?
          <a  @click="selected">Register Here</a>
        </h4>
    </div>
</div>
</template>


<script>
import { bus } from '../main.js'
import UserService from '../utils/userRequests'
import validator from 'validator';

export default {
  name: 'Login',
    data() {
    return {
      email: '',
      password: '',
      isTagPresent: false
    }
  },
  props: {
    msg: String
  },
  methods: {
    selected() {
      bus.$emit('selectedComp', 'Signup')
    },
    async login() {
      if(!this.email || !this.password) {
          return this.validationToast('Please fill out the required fields')
      }
      if(!validator.isEmail(this.email)) {
          return this.validationToast('Email is invalid')
      }
      if(this.email && this.password) {
          this.checkTags(this.email)
          this.checkTags(this.password)
          if(!this.isTagPresent) {
            const response = await UserService.loginUser({
              email: this.email,
              password: this.password
            })
            if(response == "Bad Request") {
              return this.validationToast('Please make sure you enter all the details correctly')
            }
            if(response) {
              const user = response.userData
              if(!user.confirmed) {
                return this.validationToast('Please confirm your email to login')
              }
              this.$store.dispatch('setLoggedIn', true)
              this.$router.push("/dashboard")
            }  
          }
      }
    },
    validationToast(message) {
          this.$buefy.toast.open({
            message,
            type: 'is-danger',
            duration: 3000
        })
    },
    checkTags(val) {
      if(val) {
          let reg =/<(.|\n)*?>/g; 

          if (reg.test(val) == true) {
              this.isTagPresent = true
              return this.validationToast('Tags are not allowed')
          }
      }
    }
  },
}
</script>

<style scoped>
.card-custom {
  display: flex;
  flex-direction: column;
}
.button-custom {
  background-color: rgb(255, 76, 76) !important;
  margin-top: 25px;
  font-weight: 500;
  font-size: 18px;
}
.button-custom:hover {
  background-color: white !important;
  color: rgb(255, 76, 76) !important;
  border: 2px solid rgb(255, 76, 76) !important;
  box-shadow: 1px 1px 10px 5px #d8c0c0;
  transition: 0.5s ease;
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
.card {
  margin: 10px;
}
</style>
