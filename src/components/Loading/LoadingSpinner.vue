<template>
    <div class="LoadingSpinner" :class="`is-${animation}`">
        <template v-if="animation === 'pulse'">
            <span class="dot1"></span>
            <span class="dot2"></span>
            <span></span>
            <span class="dot4"></span>
            <span class="dot5"></span>
        </template>
        <template v-else-if="animation === 'bounce'">
            <span class="dot1"></span>
            <span class="dot2"></span>
            <span></span>
        </template>
        <template v-else-if="animation === 'bars'">
            <span></span>
            <span class="dot2"></span>
            <span class="dot3"></span>
            <span class="dot4"></span>
            <span class="dot5"></span>
        </template>
        <template v-else-if="animation === 'scale'">
            <span class="dot1"></span>
            <span class="dot2"></span>
            <span class="dot3"></span>
            <span class="dot4"></span>
            <span class="dot5"></span>
        </template>
    </div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    props: {
        animation: {
            type: String,
            default: 'pulse',
            validator: function(value) {
                return (
                    ['bars', 'bounce', 'pulse', 'scale'].indexOf(value) !== -1
                )
            },
        },
    },
}
</script>
