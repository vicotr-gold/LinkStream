<template>
    <i :class="`ico ico-${icon}`"></i>
</template>

<script>
export default {
    name: 'Icon',
    props: {
        icon: {
            type: String,
            required: true,
        },
    },
}
</script>
