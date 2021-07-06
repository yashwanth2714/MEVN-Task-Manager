<template>
    <div>
        <Header /> 
        <div class="container is-flex container-custom"> 
            <div class="card animate__animated animate__slideInUp">
                <div class="card-content card-custom">
                    <section>
                        <b-field label="Name" class="custom-label">
                            <b-input v-model="name" required></b-input>
                        </b-field>
                        <br>
                        <p>Email is not editable for now</p>
                        <br>
                        <b-field label="Email"
                            class="custom-label">
                            <b-input type="email"
                                v-model="email"
                                disabled
                                required
                                >
                            </b-input>
                        </b-field>
                        <div class="field" style="margin-top: 20px;">
                            <b-field label="Email Notifications" class="custom-label email-notif">
                            <b-switch v-model="isEmailEnabled"
                                true-value="Yes"
                                false-value="No">
                            </b-switch>
                            </b-field>
                        </div>
                        <br>
                        <p>Enter your current password to update with a new one</p>
                        <br>
                        <b-field label="Current Password" class="custom-label">
                            <b-input type="password"
                                v-model="password"
                                >
                            </b-input>
                        </b-field>
                        <b-field label="New Password" class="custom-label">
                            <b-input type="password"
                                v-model="newPassword"
                                :disabled="flag">
                            </b-input>
                        </b-field>
                        <b-field label="Confirm New Password" class="custom-label">
                            <b-input type="password"
                                v-model="confirmPassword"
                                :disabled="flag">
                            </b-input>
                        </b-field>
                        <help v-show="ValidationFlag" msgType="is-danger" message="Both the passwords should match"></help>

                        <div class="buttons card-buttons">
                            <b-button @click="$router.push('profile')">Cancel</b-button>
                            <b-button type="is-primary" @click="saveProfile()">Save</b-button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserService from '../utils/userRequests'
import Header from './Header'
import bcrypt from 'bcryptjs'
import help from './help'
import validator from 'validator';

    export default {
        data() {
            return {
                user: {},
                name: '',
                email: '',
                password: '',
                newPassword: '',
                confirmPassword: '',
                flag: true,
                ValidationFlag: false,
                toastFlag: false,
                hashedWord: '',
                isTagPresent: false,
                isValidationSuccess: false,
                isEmailEnabled: 'Yes',
                isNotifChanged: 'No'
            }
        },
        components: {
            Header,
            help
        },
        methods: {
            async readProfile() {
                const response = await UserService.viewProfile()
                if(response) {
                        this.user = response.userData
                        this.name = this.user.name
                        this.email = this.user.email
                        this.hashedWord = this.user.word
                        this.isEmailEnabled = this.user.isEmailEnabled
                        this.isNotifChanged = this.user.isEmailEnabled
                }
            },
            async saveProfile() {
                if(!this.name || !this.email) {
                    return this.validationToast('Please fill out the required fields')
                }
                if(!validator.isEmail(this.email)) {
                    return this.validationToast('Email is invalid')
                }
                if(this.password && this.newPassword && !this.confirmPassword) {
                    return this.validationToast('Please confirm your password')
                }
                if(this.password && !this.newPassword && !this.confirmPassword) {
                    return this.validationToast('Please enter your new password and confirm')
                }
                if(this.newPassword && this.confirmPassword && this.newPassword != this.confirmPassword) {
                    return this.validationToast('Both the passwords should match')
                }
                if(this.ValidationFlag) {
                    return this.validationToast('Both the passwords should match')
                }
                if(this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword) {
                    this.passwordValidations(this.newPassword)
                    this.passwordValidations(this.confirmPassword)
                    this.checkTags(this.newPassword)
                    this.checkTags(this.confirmPassword)
                    if(!this.isTagPresent && this.isValidationSuccess) {
                        const response = await UserService.updateProfile({
                                        password: this.confirmPassword
                                    })
                        if(response == "Bad Request") {
                            return this.validationToast('Something went wrong')
                        }
                        this.toastFlag = true
                    }
                }
                if(this.name && this.name != this.user.name) {
                    this.checkTags(this.name)
                    if(!this.isTagPresent) {
                        const response = await UserService.updateProfile({
                                            name: this.name,
                                        })
                        if(response == "Bad Request") {
                            return this.validationToast('Something went wrong')
                        }
                        if(response == "Exists") {
                            return this.validationToast('Email already exists')
                        }
                        this.toastFlag = true
                    }
                }
                if(this.email && this.email != this.user.email) {
                    this.checkTags(this.email)
                    if(!this.isTagPresent) {
                        const response = await UserService.updateProfile({
                                            email: this.email,
                                        })
                        if(response == "Bad Request") {
                            return this.validationToast('Something went wrong')
                        }
                        this.toastFlag = true
                    }
                }

                if(this.isNotifChanged != this.isEmailEnabled) {
                    const response = await UserService.updateProfile({
                                    isEmailEnabled: this.isEmailEnabled,
                                })
                    if(response == "Bad Request") {
                        return this.validationToast('Something went wrong')
                    } else {
                        this.toastFlag = true
                    }
                }

                if(this.toastFlag) {
                    this.displayToast("Success")
                }
                this.$router.push('profile');
            },
            displayToast(response) {
                if(response === "Success") {
                    this.$buefy.toast.open({
                        message: 'Your profile is successfully updated',
                        type: 'is-success',
                        duration: 3000
                    })
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
        mounted() {
            this.readProfile()
        },
        watch: {
            password: {
                async handler(newVal) {
                    const isMatch = await bcrypt.compare(newVal, this.hashedWord)
                    if(isMatch) {
                        this.flag = false
                    } else {
                        this.flag = true
                    }
                }
            },
            confirmPassword: {
                handler(newVal) {
                    this.ValidationFlag = false
                    if(newVal != this.newPassword) {
                        this.ValidationFlag = true
                    } 
                }
            },
            newPassword: {
                handler(newVal) {
                    if(!newVal) {
                        this.ValidationFlag = false
                    }
                }
            }
        },
    }
</script>

<style scoped>
.container-custom {
    /* min-height: 100vh; */
    justify-content: center;
    align-items: center;
    margin-top: 40px;
}
.card {
    border-radius: 20px;
    margin: 0 10px;
    margin-bottom: 20px;
    min-width: 30%;
}
.card-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
.help {
    margin-bottom: 15px;
    margin-top: -5px;
}
.email-notif {
    display: flex;
    justify-content: space-between
}
</style>
