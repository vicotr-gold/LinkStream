<template>
    <div class="DropFile">
        <input
            type="file"
            v-show="false"
            :accept="acceptTypes.join(',')"
            ref="fileInput"
            @change="handleFileSelected"
        />
        <section class="preview-section" v-if="isFileAdded">
            <i class="preview-icon"></i>
            <div class="preview-body">
                <slot name="preview-body">
                    <div class="preview-title" v-html="title"></div>
                    <div class="preview-subtitle">
                        {{ filename | truncate(200) }}
                    </div>
                </slot>
            </div>
            <div class="preview-controls">
                <basic-button
                    class="file-remove-btn"
                    variant="link"
                    @click="handleRemoveClick"
                >
                    Remove File
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
                        Replace File
                    </b-dropdown-item>
                    <b-dropdown-item @click="handleRemoveClick">
                        Remove File
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </section>
        <section
            v-else
            class="upload-section"
            :class="{ highlight: isDraggingFile }"
            @drop="handleDrop"
            @dragleave="handleDragLeave"
            @dragover="handleDragOver"
            @dragenter="handleDragEnter"
            @click="showFileDialog"
        >
            <slot name="upload-section" :showFileDialog="showFileDialog">
                <div class="upload-body">
                    <div class="upload-title" v-html="title"></div>
                    <div class="upload-subtitle">No File Added</div>
                </div>
                <i class="upload-icon"></i>
            </slot>
        </section>
    </div>
</template>

<script>
import { uploaderMixin } from '~/mixins/uploader'

export default {
    name: 'DropFile',
    mixins: [uploaderMixin],
}
</script>
