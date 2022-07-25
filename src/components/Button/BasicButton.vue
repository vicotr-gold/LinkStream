<template>
    <b-button
        pill
        :type="type"
        :to="to"
        :size="size"
        :disabled="disabled"
        :variant="variant"
        @click="handleClick"
    >
        <slot></slot>
    </b-button>
</template>

<script>
export default {
    name: 'BasicButton',
    props: {
        type: {
            type: String,
            default: 'button',
        },
        size: {
            type: String,
        },
        variant: {
            type: String,
            default: 'primary',
        },
        to: {
            type: Object,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleClick() {
            if (this.to) {
                this.$router.push(this.to)
            } else {
                this.$emit('click')
            }
        },
    },
}
</script>
