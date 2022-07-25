<template>
    <ToggleButton
        class="TogglerButton"
        :value="value"
        :width="42"
        :height="26"
        :margin="2"
        @input="handleInput"
    />
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button'

export default {
    name: 'TogglerButton',
    components: {
        ToggleButton,
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleInput(value) {
            this.$emit('input', value)
        },
    },
}
</script>
