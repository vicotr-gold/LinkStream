<template>
    <div class="page page-login my-4">
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
                        Signin with Instagram
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
                            Signin with Google
                        </spinner-button>
                    </GoogleLogin>
                </b-col>
                <b-col cols="12" class="mt-4">
                    <label class="text-black fs-1 font-weight-bold">
                        Or sign in with your email
                    </label>
                </b-col>
                <b-col cols="12" class="my-3">
                    <b-form
                        @submit.stop.prevent="onSubmit"
                        @reset="resetForm"
                        :novalidate="true"
                        id="login-form"
                    >
                        <b-form-group
                            label="Email Address"
                            label-for="input_email"
                            class="mb-4 error-l-110"
                        >
                            <b-form-input
                                id="input_email"
                                name="input_email"
                                type="email"
                                v-model="form.email"
                                v-validate="{ required: true, email: true }"
                                :state="validateState('input_email')"
                                aria-describedby="email-live-feedback"
                                data-vv-as="email"
                                autocomplete="username"
                            ></b-form-input>
                            <b-form-invalid-feedback id="email-live-feedback">
                                {{ veeErrors.first('input_email') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group
                            label="Password"
                            label-for="input_password"
                            class="mb-4 pwd-form-group error-l-75"
                        >
                            <b-form-input
                                id="input_password"
                                class="pwd-input"
                                name="input_password"
                                :type="showPwd ? 'text' : 'password'"
                                v-model="form.password"
                                v-validate="{ required: true }"
                                :state="validateState('input_password')"
                                aria-describedby="password-live-feedback"
                                data-vv-as="password"
                                autocomplete="current-password"
                            ></b-form-input>
                            <b-button
                                class="toggle-pwd-btn"
                                variant="transparent"
                                @click="showPwd = !showPwd"
                            >
                                <b-icon
                                    font-scale="1"
                                    :icon="showPwd ? 'eye' : 'eye-slash'"
                                />
                            </b-button>
                            <b-form-invalid-feedback
                                id="password-live-feedback"
                            >
                                {{ veeErrors.first('input_password') }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <spinner-button
                            type="submit"
                            class="auth-btn mt-5"
                            :loading="status.loading.signin"
                            :error="status.error.signin"
                        >
                            Sign In
                        </spinner-button>
                    </b-form>
                </b-col>
                <b-col cols="12" class="my-3">
                    <b-link to="/forgot">Forgot Password?</b-link>
                </b-col>
                <b-col cols="12" class="fs--1 my-4">
                    Don't have an account?
                    <b-link to="/signup">Sign up</b-link>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { setStatusChange } from '~/utils'
import { api } from '~/services'
import { authentication } from '~/mixins'

export default {
    name: 'Login',
    mixins: [authentication],
    data() {
        return {
            form: {
                email: null,
                password: null,
            },
            showPwd: false,
            status: {
                loading: {
                    signin: false,
                },
                error: {
                    signin: null,
                },
            },
        }
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
                email: null,
                password: null,
            }

            this.$nextTick(() => {
                this.$validator.reset()
            })
        },
        onSubmit() {
            this.$validator.validateAll().then(async result => {
                if (!result) {
                    return
                }
                this.status.loading.signin = true
                const { email, password } = { ...this.form }
                const { status, data, error } = await api.users.login({
                    email,
                    password,
                })
                if (status === 'success') {
                    setStatusChange(this, 'status.error.signin', false)
                    setTimeout(() => {
                        this.$store.dispatch('auth/login', { user: data })
                    }, 1500)
                } else {
                    setStatusChange(this, 'status.error.signin')
                    this.$toast.error(error)
                }
                this.status.loading.signin = false
            })
        },
    },
}
</script>
