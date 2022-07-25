<template>
    <div class="MarketingBlock">
        <div class="Card" v-for="option in freeDls" :key="option.id">
            <b-form-checkbox
                :value="option.id"
                v-model="selectedIds"
            ></b-form-checkbox>
            <Icon class="logo" :icon="option.icon" />
            <h4 class="card-title">
                {{ option.title }}
            </h4>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'MarketingBlock',
    data() {
        return {
            selectedIds: [
                ...this.$store.state.trackAddWizard.form.selectedFreeDlIds,
            ],
        }
    },
    computed: {
        ...mapGetters({
            freeDls: 'trackAddWizard/freeDls',
        }),
    },
    created() {
        this.$bus.$on('wz.nextClick', this.validate)
        this.$bus.$on('wz.prevClick', this.updateWizardForm)
        this.$bus.$on('wz.editModal.saveClick', this.validate)
    },
    methods: {
        updateWizardForm() {
            this.$store.dispatch('trackAddWizard/updateForm', {
                selectedFreeDlIds: this.selectedIds,
            })
        },
        validate({ onSuccess }) {
            this.updateWizardForm()
            onSuccess()
        },
    },
}
</script>
