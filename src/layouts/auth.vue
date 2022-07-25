<template>
    <div class="layout layout-auth">
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand to="/" class="m-auto">
                <b-img
                    src="@/assets/img/logo/logo-h-lg.png"
                    class="logo"
                    alt="LinkStream"
                ></b-img>
            </b-navbar-brand>
        </b-navbar>
        <transition name="page" mode="out-in">
            <router-view :key="$route.fullPath"></router-view>
        </transition>
        <vue-progress-bar></vue-progress-bar>
    </div>
</template>

<script>
export default {
    name: 'Auth',
}
</script>