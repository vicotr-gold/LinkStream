<template>
    <div class="layout layout-account" :class="getMenuType">
        <!--<LoadingMask
            variant="fullscreen"
            :class="{
                'is-shown': loading,
            }"
        />-->
        <main class="layout-content">
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

export default {
    name: 'Account',
    components: {
        TopNav,
        SideNav,
    },
    computed: {
        ...mapGetters({
            getMenuType: 'getMenuType',
            //loading: 'loading/isStarted',
        }),
    },
    created() {
        this.$store.dispatch('me/loadProfile')
    },
}
</script>
