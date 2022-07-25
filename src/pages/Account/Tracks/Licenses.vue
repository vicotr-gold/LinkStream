<template>
    <div class="page page-licenses">
        <h1 class="page-title">Licenses</h1>
        <LoadingSpinner class="page-loader" v-if="loading" />
        <div v-else class="page-body">
            <div class="Card" v-for="license in licenses" :key="license.id">
                <div class="card-body">
                    <h4 class="card-title">
                        {{ license.title }} - ${{
                            license.price | trimZeroDecimal
                        }}
                    </h4>
                    <small>
                        {{ license.descripcion }}
                    </small>
                </div>
                <BasicButton
                    variant="icon"
                    class="card-edit-btn"
                    title="Edit"
                    :to="{
                        name: 'accountTracksLicenseEdit',
                        params: { id: license.id },
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Licenses',
    data() {
        return {
            loading: false,
        }
    },
    computed: {
        ...mapGetters({
            licenses: 'me/licenses',
        }),
    },
    async created() {
        this.loading = true
        await this.$store.dispatch('me/loadLicenses')
        this.loading = false
    },
}
</script>