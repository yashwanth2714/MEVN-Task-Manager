<template>
  <div class="card animate__animated animate__rotateInDownLeft">
    <div class="card-content card-custom">
      <div v-if="!checkMail">
        <h3>Sign Up Here</h3>
          <section>
            <b-field>
                <b-input placeholder="Name"
                    size="is-medium"
                    type="name"
                    icon-pack="fas"
                    icon="edit"
                    v-model="name"
                    required>
                </b-input>
            </b-field>
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
                    v-model="password1"
                    required>
                </b-input>
            </b-field>
            <b-field>
                <b-input type="password"
                    size="is-medium"
                    placeholder="Re-type Password"
                    icon-pack="fas"
                    icon="key"
                    v-model="password2"
                    required>
                </b-input>
            </b-field>
            <help v-show="ValidationFlag" msgType="is-danger" message="Both the passwords should match"></help>
          </section>
          <b-button type="is-link" class="button-custom" expanded @click="create()">Sign Up</b-button>
          <h4 style="text-align: center;">Already a member..?
            <a @click="selected">Login Here</a>
          </h4>
        </div>
        <div v-if="checkMail" class="animate__animated animate__flash">
                We have sent an email with a confirmation link to your email address. In order to complete the sign-up process, please click the confirmation link.
                <br>
                If you do not receive a confirmation email, please verify that you entered a valid email address in our sign-up form.
                <h4 style="text-align: center;">Incorrect Email..?
            <a  @click="checkMail=false">Change Here</a>
            </h4>
        </div>
    </div>
</div>
</template>


<script>
import { bus } from '../main.js'
import UserService from '../utils/userRequests'
import help from './help'
import validator from 'validator';

export default {
  name: 'Signup',
  data() {
    return {
      name: '',
      email: '',
      password1: '',
      password2: '',
      ValidationFlag: false,
      checkMail: false,
      isTagPresent: false,
      isValidationSuccess: false
    }
  },
  components: {
    help
  },
  props: {
    msg: String
  },
  methods: {
    selected() {
      bus.$emit('selectedComp', 'Login')
    },
    async create() {
      if(!this.name || !this.email || !this.password1 || !this.password2) {
        return this.validationToast("Please fill out the required fields")
      }
      if(this.password1 != this.password2) {
        return this.validationToast("Both the passwords should match")
      }
      if(!this.ValidationFlag) {
        this.passwordValidations(this.password1)
        this.passwordValidations(this.password2)
        if(!validator.isEmail(this.email)) {
          return this.validationToast('Email is invalid')
        }
        this.checkTags(this.name)
        this.checkTags(this.email)
        this.checkTags(this.password1)
        this.checkTags(this.password2)
        if(!this.isTagPresent && this.isValidationSuccess) {
            const response = await UserService.createUser({
            name: this.name,
            email: this.email,
            password: this.password2
          })
          if(response == "Bad Request") {
              return this.validationToast('Please make sure you enter all the details correctly')
          }
          if(response) {
            const user = response.userData
            if(!user.confirmed) {             
              this.checkMail = true 
              this.$buefy.toast.open({
                    message: 'Your account is successfully created',
                    type: 'is-success',
                    duration: 3000
                })
              return this.validationToast('Please confirm your email to login')
            }
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
    passwordValidations(val) {
          if(val.includes('password')) {
              return this.validationToast('Password should not contain password value')
          }

          if(!validator.isLength(val, {min:7})) {
              return this.validationToast('Password must be greater than 6')
          }

          if(!this.checkPassword(val)) {
              return this.validationToast('Password should contain atleast one digit, special character, upper and lowercase letters')
          }
    },
    checkTags(val) {
      if(val) {
          let reg =/<(.|\n)*?>/g; 

          if (reg.test(val) == true) {
              this.isTagPresent = true
              return this.validationToast('Tags are not allowed')
          }
      }
    },
    checkPassword(str) {
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/;
        if(re.test(str) == true) {
          this.isValidationSuccess = true
          return re.test(str);
        }
    }
  },
  watch: {
    password2: {
      handler(newVal) {
        if(newVal != this.password1) {
          this.ValidationFlag = true
        } else {
          this.ValidationFlag = false
        }
      }
    },
    password1: {
      handler(newVal) {
        if(!newVal) {
          this.ValidationFlag = false
        }
        if(this.password2 && newVal != this.password2) {
          this.ValidationFlag = true
        } else {
          this.ValidationFlag = false
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
.is-medium.input {
  border-radius: 15px !important;
}
</style>
