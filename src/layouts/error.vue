<template>
    <div class="layout layout-error">
        <div class="secion-overlay"></div>
        <b-container>
            <b-row>
                <b-col lg="6" offset-lg="3">
                    <b-row class="text-center text-white">
                        <b-col cols="12" class="my-3 text-center">
                            <b-img
                                src="@/assets/img/logo/logo-v-lg.png"
                                class="logo"
                                alt="LinkStream"
                            ></b-img>
                        </b-col>
                        <transition name="page" mode="out-in">
                            <router-view :key="$route.fullPath"></router-view>
                        </transition>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: 'Error',
}
</script>
