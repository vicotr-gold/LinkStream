<script>
import { api } from '~/services'

export default {
    name: 'EmailConfirm',
    methods: {
        async emailConfirm() {
            const { param1: param_1, param2: param_2 } = this.$route.params
            const { status, error } = await api.users.confirmEmail({
                param_1,
                param_2,
            })
            if (status === 'success') {
                this.$toast.success(
                    'Thank you for your confirmation. Please login to LinkStream.'
                )
            } else {
                this.$toast.error(error)
            }
            this.$router.push({ name: 'login' })
        },
    },
    render() {
        this.emailConfirm()
        return true
    },
}
</script>
