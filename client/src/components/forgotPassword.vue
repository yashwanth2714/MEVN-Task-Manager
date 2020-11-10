<template>
<div class="container is-flex container-custom animate__animated animate__lightSpeedInLeft">
  <div class="card">
    <div class="card-content card-custom">
        <div v-if="!checkMail">        
            <h3>Forgot Password</h3>
            <p>To reset your password, enter your email below and submit</p>
            <br>
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
            </section>
            <div style="text-align:center">
                <b-button v-if="!isSendClicked" type="is-link" class="button-custom" expanded @click="sendConfirmationLink()">Reset</b-button>
                <img :src="loadingSvg" v-if="isSendClicked" /> 
                <h4 style="text-align: center;">
                <router-link to="/">Back</router-link>
                </h4>
            </div>
        </div>
        <div v-if="checkMail">
                Please check your email inbox for a link to complete the reset.
                <h4 style="text-align: center;">Incorrect Email..?
            <a  @click="checkMail=false">Change Here</a>
            </h4>
        </div>
    </div>
</div>
</div>
</template>


<script>
import { bus } from '../main.js'
import UserService from '../utils/userRequests'
import validator from 'validator';

export default {
  name: 'forgotPassword',
    data() {
        return {
          email: '',
          checkMail: false,
          loadingSvg: require('@/assets/infinity.svg'),
          isSendClicked: false,
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
    async sendConfirmationLink() {
      if(!this.email) {
          return this.validationToast('Please fill out the required field')
      }
      if(!validator.isEmail(this.email)) {
          return this.validationToast('Email is invalid')
      }
      this.checkTags(this.email)
      if(this.email && !this.isTagPresent) {
          this.isSendClicked = true
          const response = await UserService.forgot(this.email)
          if(response == "Bad Request") {
            this.isSendClicked = false
            return this.validationToast('Please make sure you enter the email id correctly')
          }
          if(response == "Success") {
              this.isSendClicked = false
              this.checkMail = true
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
img {
    width: 30%;
}
</style>
