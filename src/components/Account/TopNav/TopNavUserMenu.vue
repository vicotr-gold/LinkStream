<template>
    <div class="user-menu position-relative d-inline-block" v-if="user">
        <b-dropdown
            class="dropdown-menu-right"
            right
            variant="link"
            toggle-class="text-decoration-none"
            menu-class="position-absolute"
            no-caret
        >
            <template slot="button-content">
                <span>
                    <b-img
                        v-if="user"
                        :alt="user.display_name"
                        :src="user.photo"
                        rounded="circle"
                        class="avatar"
                    />
                    <vue-letter-avatar
                        v-else
                        :name="user.display_name"
                        size="40"
                        :rounded="true"
                    />
                </span>
            </template>
            <b-dropdown-item :to="{ name: 'accountProfileEdit' }">
                Account
            </b-dropdown-item>
            <b-dropdown-item>Features</b-dropdown-item>
            <b-dropdown-item>History</b-dropdown-item>
            <b-dropdown-item>Support</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item @click="logout">Sign out</b-dropdown-item>
        </b-dropdown>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'TopNavUserMenu',
    computed: {
        ...mapGetters({
            user: 'me/user',
        }),
    },
    methods: {
        async logout() {
            await this.$store.dispatch('auth/logout')
            this.$router.push({ name: 'login' })
        },
    },
}
</script>
