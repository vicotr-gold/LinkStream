<template>
    <div
        class="DropImage"
        :class="{
            'is-inline': variant === 'inline',
        }"
    >
        <input
            type="file"
            v-show="false"
            :accept="acceptTypes.join(',')"
            ref="fileInput"
            @change="handleFileSelected"
        />
        <section class="preview-section" v-if="isFileAdded">
            <div class="preview-thumb">
                <img :src="src" @click="showFileDialog" />
                <IconButton
                    class="file-remove-icon"
                    icon="remove"
                    @click="handleRemoveClick"
                />
                <IconButton
                    class="file-replace-icon"
                    icon="cam"
                    @click="showFileDialog"
                />
            </div>
            <div class="preview-body">Artwork</div>
            <div class="preview-controls">
                <basic-button
                    class="file-remove-btn"
                    variant="link"
                    @click="handleRemoveClick"
                >
                    Remove artwork
                </basic-button>
                <b-dropdown
                    class="preview-dropdown"
                    variant="icon"
                    dropleft
                    no-caret
                >
                    <template v-slot:button-content>
                        <Icon icon="dot-menu-v" />
                    </template>
                    <b-dropdown-item @click="showFileDialog">
                        Replace
                    </b-dropdown-item>
                    <b-dropdown-item @click="handleRemoveClick">
                        Remove
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </section>
        <section class="upload-section" v-else>
            <div
                class="upload-dd"
                :class="{ highlight: isDraggingFile }"
                @drop="handleDrop"
                @dragleave="handleDragLeave"
                @dragover="handleDragOver"
                @dragenter="handleDragEnter"
                @click="showFileDialog"
            >
                <i class="upload-icon"></i>
                <div class="upload-msg">
                    <div class="upload-msg-s" v-html="msgShort"></div>
                    <div class="upload-msg-l" v-html="msgLong"></div>
                </div>
            </div>
            <div class="upload-controls">
                <slot name="upload-controls" :showFileDialog="showFileDialog">
                    <basic-button
                        class="file-add-btn"
                        variant="link"
                        @click="showFileDialog"
                    >
                        Add artwork
                    </basic-button>
                </slot>
            </div>
        </section>

        <DokaModal
            v-if="isFileSelected"
            :src="tmpFile"
            :crop-aspect-ratio="aspectRatio"
            @confirm="handleDokaConfirm"
            @cancel="handleDokaCancel"
        />
    </div>
</template>

<script>
import { uploaderMixin } from '~/mixins/uploader'
import { DokaModal } from 'vue-doka'
import { blobToBase64 } from 'base64-blob'

export default {
    name: 'DropImage',
    mixins: [uploaderMixin],
    components: { DokaModal },
    props: {
        variant: {
            type: String,
        },
        aspectRatio: {
            type: String,
            default: '1',
        },
        acceptTypes: {
            type: Array,
            default: () => ['.png', '.jpg', '.jpeg'],
        },
        msgShort: {
            type: String,
            default: '<u>Upload</u><br>an image',
        },
        msgLong: {
            type: String,
            default: 'Drag image here<br>&nbsp;or&nbsp;<u>browse</u>',
        },
    },
    data() {
        return {
            tmpFile: null,
        }
    },
    computed: {
        isFileSelected() {
            return !!this.tmpFile
        },
    },
    methods: {
        showInvalidFileAlert() {
            this.$toast.error(
                `Only ${this.acceptTypes
                    .slice(0, -1)
                    .join(', ')} and ${this.acceptTypes
                    .slice(-1)
                    .join(', ')} images allowed`
            )
        },
        async addFile(file) {
            if (!this.validateFile(file)) {
                this.showInvalidFileAlert()
                return
            }
            const base64 = await blobToBase64(file)
            this.tmpFile = null
            if (base64) {
                this.$emit('add-file', {
                    name: file.name,
                    blob: file,
                    base64,
                })
            } else {
                this.$toast.error('Something went wrong, please try again.')
            }
        },
        handleRemoveClick() {
            this.tmpFile = null
            this.removeFile()
        },
        handleDrop(e) {
            e.preventDefault()
            e.stopPropagation()
            this.isDraggingFile = false
            const file = e.dataTransfer.files[0]
            if (!this.validateFile(file)) {
                this.showInvalidFileAlert()
                return
            }
            this.tmpFile = file
        },
        handleFileSelected(e) {
            const file = e.target.files[0]
            if (!this.validateFile(file)) {
                this.showInvalidFileAlert()
                return
            }
            this.tmpFile = file
        },
        handleDokaCancel() {
            this.tmpFile = null
        },
        handleDokaConfirm(output) {
            this.addFile(output.file)
        },
    },
}
</script>
