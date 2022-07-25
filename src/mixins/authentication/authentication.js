import GoogleLogin from 'vue-google-login'
import { setStatusChange } from '~/utils'
import { api } from '~/services'

export default {
    components: {
        GoogleLogin,
    },
    data() {
        return {
            google: {
                client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            },
            instagram: {
                client_id: process.env.VUE_APP_INSTAGRAM_CLIENT_ID,
                redirect_uri: window.location.href,
            },
            status: {
                loading: {
                    google: false,
                    instagram: false,
                },
                error: {
                    google: null,
                    instagram: null,
                },
            },
        }
    },
    methods: {
        async onGoogleSuccess(googleUser) {
            const { id_token: platform_token } = googleUser.getAuthResponse()
            if (platform_token) {
                this.status.loading.google = true
                const { status, data, error } = await api.users.googleLogin({
                    platform_token,
                })
                if (status === 'success') {
                    setStatusChange(this, 'status.error.google', false)
                    setTimeout(() => {
                        this.$store.dispatch('auth/login', { user: data })
                    }, 1500)
                } else {
                    setStatusChange(this, 'status.error.google')
                    this.$toast.error(error)
                }
                this.status.loading.google = false
            }
        },
        async onInstagramSuccess(instagramUser) {
            const { code } = instagramUser
            const { redirect_uri: redirect_url } = this.instagram
            if (code && redirect_url) {
                this.status.loading.instagram = true
                const { status, data, error } = await api.users.instagram({
                    code,
                    redirect_url,
                })
                if (status === 'success') {
                    setStatusChange(this, 'status.error.instagram', false)
                    setTimeout(() => {
                        this.$store.dispatch('auth/login', { user: data })
                    }, 1500)
                } else {
                    setStatusChange(this, 'status.error.instagram')
                    this.$toast.error(error)
                }
                this.status.loading.instagram = false
            }
        },
        authenticateInstagram() {
            const _this = this
            const { client_id, redirect_uri } = this.instagram
            // Pop-up window size, change if you want
            const popupWidth = 700,
                popupHeight = 500,
                popupLeft = (window.screen.width - popupWidth) / 2,
                popupTop = (window.screen.height - popupHeight) / 2
            // Url needs to point to instagram_auth.php
            const popup = window.open(
                `https://instagram.com/oauth/authorize/?app_id=${client_id}&redirect_uri=${redirect_uri}&scope=user_profile,user_media&response_type=code`,
                '',
                'width=' +
                    popupWidth +
                    ',height=' +
                    popupHeight +
                    ',left=' +
                    popupLeft +
                    ',top=' +
                    popupTop +
                    ''
            )
            const interval = setInterval(function() {
                try {
                    // Check if hash exists
                    if (popup.location.search.length) {
                        // Hash found, that includes the access token
                        clearInterval(interval)
                        var code = popup.location.search.slice(6) //slice ?code= from string
                        popup.close()
                        _this.onInstagramSuccess({ code })
                    }
                } catch (e) {
                    // Permission denied
                }
            }, 100)
        },
    },
}
