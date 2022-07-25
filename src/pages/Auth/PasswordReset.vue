<template>
    <div class="page page-pass-reset my-4">
        <b-container>
            <b-row class="text-center">
                <b-col cols="12" class="mt-5">
                    <h2 class="text-black font-weight-bolder">
                        Reset Password
                    </h2>
                    <p class="fs-1 mx-auto my-4">
                        Enter the your new password below.
                    </p>
                </b-col>
                <b-col cols="12" class="my-3">
                    <b-form
                        @submit.stop.prevent="onSubmit"
                        @reset="resetForm"
                        :novalidate="true"
                        id="password-reset-form"
                    >
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
                        <spinner-button
                            type="submit"
                            class="text-uppercase mt-5"
                            :loading="status.loading.reset"
                            :error="status.error.reset"
                        >
                            Reset
                        </spinner-button>
                    </b-form>
                </b-col>
                <b-col cols="12" class="fs--1 my-2">
                    Need help?
                    <b-link to="/" class="ml-2">Contact Us</b-link>
                </b-col>
                <b-col cols="12" class="fs--1 my-2">
                    Already have an account?
                    <b-link to="/login">Sign in</b-link>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { setStatusChange } from '~/utils'
import { api } from '~/services'

export default {
    name: 'PasswordReset',
    data() {
        return {
            form: {
                password: null,
                repassword: null,
            },
            status: {
                loading: {
                    reset: false,
                },
                error: {
                    reset: null,
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
                password: null,
                repassword: null,
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
                this.status.loading.reset = true
                const { password: new_password } = this.form
                const { param1: param_1, param2: param_2 } = this.$route.params
                const { status, error } = await api.users.resetPassword({
                    param_1,
                    param_2,
                    new_password,
                })
                if (status === 'success') {
                    setStatusChange(this, 'status.error.reset', false, () => {
                        this.resetForm()
                    })
                    this.$toast.success(
                        'Your password has been changed successfully. User your new password to login.'
                    )
                    setTimeout(() => {
                        this.$router.push({ name: 'login' })
                    }, 1500)
                } else {
                    setStatusChange(this, 'status.error.reset')
                    this.$toast.error(error)
                }
                this.status.loading.reset = false
            })
        },
    },
}
</script>
