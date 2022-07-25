<template>
    <div
        class="layout layout-account layout-account-settings"
        :class="getMenuType"
    >
        <main class="layout-content">
            <h1>Account</h1>
            <TabNav />
            <transition name="page" mode="out-in">
                <router-view :key="$route.fullPath"></router-view>
            </transition>
        </main>
        <TopNav />
        <SideNav :class="getMenuType" />
        <vue-progress-bar></vue-progress-bar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopNav from '~/components/Account/TopNav/TopNav'
import SideNav from '~/components/Account/SideNav/SideNav'
import TabNav from '~/components/Account/Settings/TabNav'

export default {
    name: 'AccountSettings',
    components: {
        TopNav,
        SideNav,
        TabNav,
    },
    computed: {
        ...mapGetters({
            getMenuType: 'getMenuType',
        }),
    },
    created() {
        this.$store.dispatch('me/loadProfile')
    },
}
</script>
