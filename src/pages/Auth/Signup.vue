<template>
    <div class="page page-signup my-4">
        <b-container>
            <b-row class="text-center">
                <b-col cols="12" class="my-2">
                    <spinner-button
                        instagram
                        class="auth-btn"
                        :loading="status.loading.instagram"
                        :error="status.error.instagram"
                        @click="authenticateInstagram"
                    >
                        <i class="ig-ico fab fa-instagram fa-lg"></i>
                        Sign up with Instagram
                    </spinner-button>
                </b-col>
                <b-col cols="12" class="my-2">
                    <GoogleLogin
                        class="g-login-btn-wrap col"
                        :params="google"
                        :onSuccess="onGoogleSuccess"
                    >
                        <spinner-button
                            google
                            class="auth-btn"
                            :loading="status.loading.google"
                            :error="status.error.google"
                        >
                            <i class="g-ico fab fa-google fa-1x"></i>
                            Sign up with Google
                        </spinner-button>
                    </GoogleLogin>
                </b-col>
                <b-col cols="12" class="mt-4">
                    <label class="text-black fs-1 font-weight-bold">
                        Or sign up with your email
                    </label>
                </b-col>
                <b-col cols="12" class="my-3">
                    <b-form
                        @submit.stop.prevent="onSubmit"
                        @reset="resetForm"
                        :novalidate="true"
                        id="signup-form"
                    >
                        <b-form-group
                            label="Username"
                            label-for="input_username"
                            class="error-l-80 mb-4"
                        >
                            <b-form-input
                                id="input_username"
                                name="input_username"
                                type="text"
                                v-model="form.name"
                                v-validate="{
                                    required: true,
                                    min: 5,
                                    uniqueUsername: true,
                                }"
                                :state="validateState('input_username')"
                                aria-describedby="username-live-feedback"
                                data-vv-as="username"
                                data-vv-delay="200"
                                autocomplete="off"
                            ></b-form-input>
                            <b-button
                                variant="transparent"
                                class="btn btn-input-spinner"
                                v-if="validating.username"
                            >
                                <b-spinner></b-spinner>
                            </b-button>
                            <b-form-invalid-feedback
                                id="username-live-feedback"
                            >
                                {{ veeErrors.first('input_username') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group
                            label="Email Address"
                            label-for="input_email"
                            class="error-l-110 mb-4"
                        >
                            <b-form-input
                                id="input_email"
                                name="input_email"
                                type="email"
                                v-model="form.email"
                                v-validate="{
                                    required: true,
                                    email: true,
                                    uniqueEmail: true,
                                }"
                                :state="validateState('input_email')"
                                aria-describedby="email-live-feedback"
                                data-vv-as="email"
                                data-vv-delay="200"
                                autocomplete="off"
                            ></b-form-input>
                            <b-button
                                variant="transparent"
                                class="btn btn-input-spinner"
                                v-if="validating.email"
                            >
                                <b-spinner></b-spinner>
                            </b-button>
                            <b-form-invalid-feedback id="email-live-feedback">
                                {{ veeErrors.first('input_email') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group
                            label="Password"
                            label-for="input_password"
                            class="error-l-75 mb-4"
                        >
                            <b-form-input
                                id="input_password"
                                name="input_password"
                                type="password"
                                v-model="form.password"
                                v-validate="{ required: true, min: 8 }"
                                :state="validateState('input_password')"
                                aria-describedby="password-live-feedback"
                                data-vv-as="password"
                                autocomplete="new-password"
                                ref="password"
                            ></b-form-input>
                            <b-form-invalid-feedback
                                id="password-live-feedback"
                            >
                                {{ veeErrors.first('input_password') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group
                            label="Retype Password"
                            label-for="input_password_confirm"
                            class="error-l-130 mb-4"
                        >
                            <b-form-input
                                id="input_password_confirm"
                                name="input_password_confirm"
                                type="password"
                                v-model="form.repassword"
                                v-validate="{
                                    required: true,
                                    min: 8,
                                    confirmed: 'password',
                                }"
                                :state="validateState('input_password_confirm')"
                                aria-describedby="password-confirm-live-feedback"
                                data-vv-as="password"
                                autocomplete="new-password"
                            ></b-form-input>
                            <b-form-invalid-feedback
                                id="password-confirm-live-feedback"
                            >
                                {{ veeErrors.first('input_password_confirm') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group
                            class="fs--2 text-center text-gray mb-2 px-md-5"
                        >
                            By clicking Sign Up below, you agree to our
                            <b-link to="/legal" target="_blank">
                                Terms of Use
                            </b-link>
                            &nbsp;and&nbsp;
                            <b-link to="/legal" target="_blank">
                                Privacy Policy
                            </b-link>
                            .
                        </b-form-group>
                        <spinner-button
                            type="submit"
                            class="auth-btn mt-5"
                            :loading="status.loading.signup"
                            :error="status.error.signup"
                        >
                            Sign Up
                        </spinner-button>
                    </b-form>
                </b-col>
                <b-col cols="12" class="fs--1 my-4">
                    Already have an account?
                    <b-link to="/login">Sign in</b-link>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { Validator } from 'vee-validate'
import { setStatusChange } from '~/utils'
import { api } from '~/services'
import { authentication } from '~/mixins'

export default {
    name: 'Signup',
    mixins: [authentication],
    data() {
        return {
            form: {
                name: null,
                email: null,
                password: null,
                repassword: null,
            },
            status: {
                loading: {
                    signup: false,
                },
                error: {
                    signup: null,
                },
            },
            validating: {
                username: false,
                email: false,
            },
        }
    },
    mounted() {
        // Username and email availability validations
        Validator.extend('uniqueUsername', {
            validate: value => this.availabilityValidator('username', value),
            getMessage: (field, params, data) => data.message,
        })
        Validator.extend('uniqueEmail', {
            validate: value => this.availabilityValidator('email', value),
            getMessage: (field, params, data) => data.message,
        })
    },
    methods: {
        validateState(ref) {
            if (
                this.veeFields[ref] &&
                (this.veeFields[ref].dirty || this.veeFields[ref].validated)
            ) {
                return !this.veeErrors.has(ref)
            }
            return null
        },
        resetForm() {
            this.form = {
                name: null,
                email: null,
                password: null,
                repassword: null,
            }

            this.$nextTick(() => {
                this.$validator.reset()
            })
        },
        async availabilityValidator(field, value) {
            this.validating[field] = true
            const { status, error } = await api.users.getAvailability({
                type: field,
                value,
            })
            this.validating[field] = false
            if (status !== 'success') {
                return { data: { message: error } }
            }
            return { valid: true }
        },
        onSubmit() {
            this.$validator.validateAll().then(async result => {
                if (!result) {
                    return
                }
                this.status.loading.signup = true
                const params = {
                    user_name: this.form.name,
                    email: this.form.email,
                    password: this.form.password,
                }
                const { status, data, error } = await api.users.signup(params)
                if (status === 'success') {
                    setStatusChange(this, 'status.error.signup', false)
                    setTimeout(() => {
                        this.$store.dispatch('auth/signup', { user: data })
                    }, 1500)
                } else {
                    setStatusChange(this, 'status.error.signup')
                    this.$toast.error(error)
                }
                this.status.loading.signup = false
            })
        },
    },
}
</script>
