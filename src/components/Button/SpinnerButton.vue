<template>
    <b-button
        pill
        :type="type"
        :variant="variant"
        :size="size"
        :disabled="loading"
        @click="handleClick"
        :class="{
            'btn-spinner': true,
            'show-spinner': loading,
            'show-success': !loading && error === false,
            'show-fail': !loading && error,
            'is-ig': instagram,
            'is-g': google,
        }"
    >
        <span class="spinner">
            <span class="bounce1"></span>
            <span class="bounce2"></span>
            <span class="bounce3"></span>
        </span>
        <i class="s-ico s-ico-succ far fa-check-circle"></i>
        <i class="s-ico s-ico-fail fas fa-exclamation-triangle"></i>
        <span class="label">
            <slot></slot>
        </span>
    </b-button>
</template>

<script>
export default {
    name: 'SpinnerButton',
    props: {
        type: {
            type: String,
            default: 'button',
        },
        variant: {
            type: String,
            default: 'primary',
        },
        size: {
            type: String,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        error: {
            type: Boolean,
            default: null,
        },
        instagram: {
            type: Boolean,
            default: false,
        },
        google: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleClick() {
            this.$emit('click')
        },
    },
}
</script>
