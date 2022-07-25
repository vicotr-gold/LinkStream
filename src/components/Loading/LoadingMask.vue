<template>
    <div
        class="LoadingMask"
        :class="variant ? `is-${variant}` : ''"
        role="status"
    >
        <LoadingSpinner />
    </div>
</template>

<script>
export default {
    name: 'LoadingMask',
    props: {
        variant: {
            type: String,
        },
    },
}
</script>