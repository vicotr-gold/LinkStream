<template>
    <b-modal modal-class="InfoEditModal" v-model="open" size="lg" centered>
        <template v-slot:modal-header>
            <BasicButton variant="icon" class="modal-close" @click="close" />
            <h2 class="modal-title">Track Info</h2>
        </template>

        <template v-slot:default>
            <InfoBlock />
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
import InfoBlock from '../Block/InfoBlock'

export default {
    name: 'InfoEditModal',
    components: {
        InfoBlock,
    },
    data() {
        return {
            open: false,
        }
    },
    created() {
        this.$bus.$on('wz.modal.info.open', this.handleOpen)
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
