<template>
    <div class="Card">
        <h4 class="card-title" v-html="title"></h4>
        <div class="card-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseCard',
    props: {
        title: {
            type: String,
        },
    },
}
</script>