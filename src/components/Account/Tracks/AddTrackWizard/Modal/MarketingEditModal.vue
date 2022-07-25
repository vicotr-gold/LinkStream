<template>
    <b-modal modal-class="MarketingEditModal" v-model="open" size="lg" centered>
        <template v-slot:modal-header>
            <BasicButton variant="icon" class="modal-close" @click="close" />
            <h2 class="modal-title">Marketing</h2>
        </template>

        <template v-slot:default>
            <MarketingBlock />
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
import MarketingBlock from '../Block/MarketingBlock'

export default {
    name: 'MarketingEditModal',
    components: {
        MarketingBlock,
    },
    data() {
        return {
            open: false,
        }
    },
    created() {
        this.$bus.$on('wz.modal.marketing.open', this.handleOpen)
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
