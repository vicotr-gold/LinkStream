import { blobToBase64 } from 'base64-blob'

export const uploaderMixin = {
    props: {
        title: {
            type: String,
        },
        src: {
            type: String,
        },
        filename: {
            type: String,
        },
        acceptTypes: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isDraggingFile: false,
        }
    },
    computed: {
        isFileAdded() {
            return !!this.src
        },
    },
    methods: {
        showInvalidFileAlert() {
            this.$toast.error(
                `Only ${this.acceptTypes
                    .slice(0, -1)
                    .join(', ')} and ${this.acceptTypes
                    .slice(-1)
                    .join(', ')} files allowed`
            )
        },
        showFileDialog() {
            this.$refs.fileInput.value = null
            this.$refs.fileInput.click()
        },
        validateFile(file) {
            const acceptTypes = this.acceptTypes
            if (!acceptTypes.length) {
                return true
            }
            if (acceptTypes.indexOf(file.type) !== -1) {
                return true
            }
            const extIndex = file.name.lastIndexOf('.')
            if (extIndex === -1) {
                return false
            }
            const ext = file.name.substr(extIndex)
            return acceptTypes.indexOf(ext) !== -1
        },
        async addFile(file) {
            if (!this.validateFile(file)) {
                this.showInvalidFileAlert()
                return
            }
            const base64 = await blobToBase64(file)
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
        removeFile() {
            this.$emit('remove-file')
        },
        handleRemoveClick() {
            this.removeFile()
        },
        handleFileSelected(e) {
            this.addFile(e.target.files[0])
        },
        handleDragEnter(e) {
            e.preventDefault()
            e.stopPropagation()
            this.isDraggingFile = true
        },
        handleDragOver(e) {
            e.preventDefault()
            e.stopPropagation()
            this.isDraggingFile = true
        },
        handleDragLeave(e) {
            e.preventDefault()
            e.stopPropagation()
            this.isDraggingFile = false
        },
        handleDrop(e) {
            e.preventDefault()
            e.stopPropagation()
            this.isDraggingFile = false
            this.addFile(e.dataTransfer.files[0])
        },
    },
}
