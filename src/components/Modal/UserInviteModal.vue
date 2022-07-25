<template>
    <b-modal modal-class="UserInviteModal" size="md" centered v-model="open">
        <template v-slot:modal-header>
            <BasicButton variant="icon" class="modal-close" @click="close" />
            <h2 class="modal-title">Invite collaborator</h2>
            <h4 class="modal-subtitle">
                Send an invitation to join and collaborate
            </h4>
        </template>

        <template v-slot:default>
            <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': $v.email.$error }"
                placeholder="Email Address"
                v-model="$v.email.$model"
                @keyup.enter="handleSubmit"
            />
            <div class="invalid-feedback">
                Enter a valid email
            </div>
        </template>

        <template v-slot:modal-footer>
            <spinner-button
                size="md"
                :loading="processing"
                @click="handleSubmit"
            >
                Send Invite
            </spinner-button>
        </template>
    </b-modal>
</template>

<script>
import { api } from '~/services'
import { mapGetters } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'

export default {
    name: 'UserInviteModal',
    data() {
        return {
            open: false,
            processing: false,
            email: null,
        }
    },
    computed: {
        ...mapGetters({ user: 'me/user' }),
    },
    validations: {
        email: {
            required,
            email,
        },
    },
    created() {
        this.$bus.$on('modal.userInvite.open', this.handleOpen)
    },
    methods: {
        close() {
            this.open = false
            this.$v.email.$reset()
        },
        async handleSubmit() {
            this.$v.email.$touch()
            if (this.$v.email.$invalid) {
                return
            }
            this.processing = true
            const { status, data } = await api.users.inviteCollab({
                user_id: this.user.id,
                email: this.email,
            })
            if (status === 'success') {
                const { id, user_name: name, data_image: photo } = data
                this.$bus.$emit('modal.userInvite.userInvited', {
                    id,
                    name,
                    photo,
                })
            }
            this.open = false
            this.processing = false
        },
        handleOpen() {
            this.email = null
            this.open = true
        },
    },
}
</script>
