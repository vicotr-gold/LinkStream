<template>
    <b-modal
        modal-class="AlertBox"
        size="md"
        v-model="open"
        centered
        hide-header
    >
        <IconButton class="alert-close-btn" icon="close" @click="close" />
        <h2 class="alert-title" v-html="opts.title" v-if="opts.title"></h2>
        <p class="alert-message" v-html="opts.message" v-if="opts.message"></p>
        <template v-slot:modal-footer>
            <basic-button
                class="action-btn"
                variant="secondary"
                size="md"
                v-if="opts.cancelShow"
                @click="handleCancelClick"
            >
                {{ opts.cancelText }}
            </basic-button>
            <spinner-button
                class="action-btn"
                size="md"
                v-if="opts.okShow"
                @click="handleOkClick"
            >
                {{ opts.okText }}
            </spinner-button>
        </template>
    </b-modal>
</template>

<script>
const Type = {
    CONFIRM: 'confirm',
    ALERT: 'alert',
}

const defaultOpts = {
    title: null,
    message: null,
    okShow: true,
    okText: 'OK',
    onOk: null,
    cancelShow: true,
    cancelText: 'Cancel',
    onCancel: null,
}

export default {
    name: 'AlertBox',
    data() {
        return {
            open: false,
            type: null,
            opts: {
                ...defaultOpts,
            },
        }
    },
    methods: {
        confirm(opts = {}) {
            this.type = Type.CONFIRM
            this.opts = {
                ...defaultOpts,
                okText: 'Confirm',
                ...opts,
            }
            this.open = true
        },
        ok(message, { title = '', okText = 'OK' } = {}) {
            this.type = Type.ALERT
            this.opts = {
                ...defaultOpts,
                title,
                message,
                okText,
                cancelShow: false,
            }
            this.open = true
        },
        oops(message, { title = 'Oops!', okText = 'OK' } = {}) {
            this.type = Type.ALERT
            this.opts = {
                ...defaultOpts,
                title,
                message,
                okText,
                cancelShow: false,
            }
            this.open = true
        },
        close() {
            this.open = false
        },
        handleOkClick() {
            typeof this.opts.onOk === 'function' && this.opts.onOk()
            this.close()
        },
        handleCancelClick() {
            typeof this.opts.onCancel === 'function' && this.opts.onCancel()
            this.close()
        },
    },
}
</script>
