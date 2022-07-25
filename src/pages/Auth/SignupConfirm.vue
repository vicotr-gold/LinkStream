<template>
    <div class="page page-signup-conf my-4">
        <b-container>
            <b-row class="text-center">
                <b-col cols="12" class="my-5">
                    <h2 class="text-black font-weight-bolder">
                        Confirm Email Address
                    </h2>
                    <p class="fs-1 mx-auto my-4">
                        Please check your inbox to confirm your email address
                        and complete signup.
                    </p>
                    <b-button variant="link" @click="resendConfirationEmail">
                        Resend confirmation email
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { api } from '~/services'

export default {
    name: 'SignupConfirm',
    mounted() {
        // Redirect to signup page when there is no information of signup user
        if (!this.$store.getters.pendingUser) {
            this.$router.push({ name: 'signup' })
        }
    },
    methods: {
        async resendConfirationEmail() {
            const { id: user_id } = this.$store.getters.pendingUser
            const { status, error } = await api.users.resendConfirmEmail({
                user_id,
            })
            if (status === 'success') {
                this.$toast.success(
                    'We have sent confirmation email successfully.'
                )
            } else {
                this.$toast.error(error)
            }
        },
    },
}
</script>
