<template>
    <div
        class="UnlimitedInputGroup input-group"
        :class="{ 'is-unlimited': isUnlimited }"
    >
        <div class="input-group-prepend">
            <button
                type="button"
                class="btn btn-outline-secondary"
                @click="handleUnlimitedClick"
            >
                Unlimited
            </button>
        </div>
        <input
            type="text"
            class="form-control"
            ref="input"
            v-model.lazy="localValue"
            @focusin="handleCustomFocusIn"
            @focusout="handleCustomFocusOut"
        />
    </div>
</template>

<script>
import Cleave from 'cleave.js'
import { stripCommas } from '~/utils'

const VALUE_UNLIMITED = 'Unlimited'

export default {
    name: 'UnlimitedInputGroup',
    props: {
        value: {
            type: String,
        },
    },
    data() {
        return { localValue: this.value.trim() }
    },
    computed: {
        isUnlimited() {
            return this.localValue === VALUE_UNLIMITED
        },
    },
    mounted() {
        const { input } = this.$refs
        new Cleave(input, { numeral: true })
        if (this.isUnlimited) {
            input.value = VALUE_UNLIMITED
        }
    },
    methods: {
        updateValue(value) {
            this.localValue = value
            this.$emit('input', stripCommas(value))
        },
        handleUnlimitedClick() {
            !this.isUnlimited && this.updateValue(VALUE_UNLIMITED)
        },
        handleCustomFocusIn() {
            if (this.isUnlimited) {
                this.localValue = ''
            }
        },
        handleCustomFocusOut() {
            this.updateValue(this.localValue || VALUE_UNLIMITED)
        },
    },
}
</script>
