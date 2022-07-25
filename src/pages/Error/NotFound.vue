<template>
    <b-col cols="12" class="my-4">
        <h1 class="title">404</h1>
        <p class="my-5">Sorry, we could not find that page</p>
        <b-link :to="{ name: 'home' }" class="">
            To Home
        </b-link>
    </b-col>
</template>

<script>
export default {
    name: 'NotFound',
}
</script>
