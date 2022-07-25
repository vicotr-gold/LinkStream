<template>
    <button class="btn btn-icon" :type="type" @click="handleClick">
        <slot>
            <Icon :icon="icon" />
        </slot>
    </button>
</template>

<script>
export default {
    name: 'IconButton',
    props: {
        type: {
            type: String,
            default: 'button',
        },
        icon: {
            type: String,
        },
    },
    methods: {
        handleClick() {
            this.$emit('click')
        },
    },
}
</script>
