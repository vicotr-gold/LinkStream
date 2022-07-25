<template>
    <div class="layout layout-default">
        <transition name="page" mode="out-in">
            <router-view :key="$route.fullPath"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Default',
}
</script>
