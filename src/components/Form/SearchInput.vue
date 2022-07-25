<template>
    <div class="SearchInput">
        <Icon class="input-icon" icon="search" />
        <input
            type="text"
            class="form-control"
            :value="value"
            :placeholder="placeholder"
            :maxlength="maxlength"
            @input="handleInput"
            @focus="handleFocus"
        />
        <IconButton
            icon="close"
            class="input-clear-btn"
            @click="handleClearClick"
            v-show="!!value"
        />
    </div>
</template>

<script>
export default {
    name: 'SearchInput',
    props: {
        value: {
            type: String,
        },
        placeholder: {
            type: String,
        },
        maxlength: {
            type: String,
        },
    },
    methods: {
        handleInput(e) {
            this.$emit('input', e.target.value)
        },
        handleClearClick() {
            this.$emit('input', '')
        },
        handleFocus() {
            this.$emit('focus')
        },
    },
}
</script>