<template>
    <div>
        <LicenseCard
            v-for="license in licenses"
            :key="license.id"
            :license="license"
            :checked="selectedIds.indexOf(license.id) > -1"
            @updated="handleLicenseUpdated"
            @checked="handleLicenseChecked"
            @unchecked="handleLicenseUnchecked"
        />
    </div>
</template>

<script>
import LicenseCard from '../Card/LicenseCard'
import { mapGetters } from 'vuex'

export default {
    name: 'LicensesBlock',
    components: {
        LicenseCard,
    },
    data() {
        return {
            selectedIds: [
                ...this.$store.state.trackAddWizard.form.selectedLicenseIds,
            ],
        }
    },
    computed: {
        ...mapGetters({
            licenses: 'trackAddWizard/licenses',
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
                selectedLicenseIds: this.selectedIds,
            })
        },
        validate({ onSuccess }) {
            if (!this.selectedIds.length) {
                this.$toast.error('Pick one or more licenses.')
                return
            }
            this.updateWizardForm()
            onSuccess()
        },
        handleLicenseChecked(license) {
            const index = this.selectedIds.indexOf(license.id)
            index === -1 && this.selectedIds.push(license.id)
        },
        handleLicenseUnchecked(license) {
            const index = this.selectedIds.indexOf(license.id)
            this.selectedIds.splice(index, 1)
        },
        handleLicenseUpdated(license) {
            this.$store.dispatch('trackAddWizard/updateLicense', license)
        },
    },
}
</script>
