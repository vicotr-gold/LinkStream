<template>
    <b-modal v-model="open" size="lg" centered>
        <template v-slot:modal-header>
            <BasicButton variant="icon" class="modal-close" @click="close" />
            <h2 class="modal-title">Licenses</h2>
        </template>

        <template v-slot:default>
            <LicensesBlock />
        </template>

        <template v-slot:modal-footer>
            <basic-button
                class="action-btn cancel-btn"
                variant="secondary"
                @click="close"
            >
                Cancel
            </basic-button>
            <basic-button class="action-btn" @click="handleSaveClick">
                Save
            </basic-button>
        </template>
    </b-modal>
</template>

<script>
import LicensesBlock from '../Block/LicensesBlock'

export default {
    name: 'LicensesEditModal',
    components: {
        LicensesBlock,
    },
    data() {
        return {
            open: false,
        }
    },
    created() {
        this.$bus.$on('wz.modal.licenses.open', this.handleOpen)
    },
    methods: {
        close() {
            this.open = false
        },
        handleSaveClick() {
            this.$bus.$emit('wz.editModal.saveClick', {
                onSuccess: this.close,
            })
        },
        handleOpen() {
            this.open = true
        },
    },
}
</script>
