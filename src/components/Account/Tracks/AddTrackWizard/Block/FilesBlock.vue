<template>
    <div class="FilesBlock">
        <DropAudio
            title="Untagged .MP3"
            :class="{ 'is-invalid': $v.files.untaggedMp3.$error }"
            :src="files.untaggedMp3 && files.untaggedMp3.base64"
            :filename="files.untaggedMp3 && files.untaggedMp3.name"
            :acceptTypes="['.mp3']"
            @add-file="handleUntaggeMp3Add"
            @remove-file="handleUntaggedMp3Remove"
        />
        <DropAudio
            title="Untagged .WAV"
            :class="{ 'is-invalid': $v.files.untaggedWav.$error }"
            :src="files.untaggedWav && files.untaggedWav.base64"
            :filename="files.untaggedWav && files.untaggedWav.name"
            :acceptTypes="['.wav']"
            @add-file="handleUntaggedWavAdd"
            @remove-file="handleUntaggedWavRemove"
        />
        <DropAudio
            title="Tagged Streaming File (.MP3 or .WAV)"
            :src="files.tagged && files.tagged.base64"
            :filename="files.tagged && files.tagged.name"
            @add-file="handleTaggedAdd"
            @remove-file="handleTaggedRemove"
        />
        <DropFile
            title="Track Stems .ZIP (or .RAR)"
            :class="{ 'is-invalid': $v.files.stems.$error }"
            :acceptTypes="['.rar', '.zip']"
            :src="files.stems && files.stems.base64"
            :filename="files.stems && files.stems.name"
            @add-file="handleStemsAdd"
            @remove-file="handleStemsRemove"
        />
    </div>
</template>

<script>
import { DropAudio, DropFile } from '~/components/Uploader'

export default {
    name: 'FilesBlock',
    components: {
        DropAudio,
        DropFile,
    },
    data() {
        return {
            files: { ...this.$store.state.trackAddWizard.form.files },
        }
    },
    validations() {
        return {
            files: this.$store.getters['trackAddWizard/validations'].files,
        }
    },
    created() {
        this.$bus.$on('wz.nextClick', this.validate)
        this.$bus.$on('wz.prevClick', this.updateWizardForm)
        this.$bus.$on('wz.editModal.saveClick', this.validate)
    },
    methods: {
        updateWizardForm() {
            this.$store.dispatch('trackAddWizard/updateForm', {
                files: { ...this.files },
            })
        },
        validate({ onSuccess }) {
            this.$v.files.$touch()
            if (this.$v.files.$invalid) {
                this.$toast.error('Add required files.')
                return
            }
            this.updateWizardForm()
            onSuccess()
        },
        handleUntaggeMp3Add({ name, base64 }) {
            this.files = {
                ...this.files,
                untaggedMp3: {
                    name,
                    base64,
                },
            }
        },
        handleUntaggedMp3Remove() {
            this.files = {
                ...this.files,
                untaggedMp3: null,
            }
        },
        handleUntaggedWavAdd({ name, base64 }) {
            this.files = {
                ...this.files,
                untaggedWav: {
                    name,
                    base64,
                },
            }
        },
        handleUntaggedWavRemove() {
            this.files = {
                ...this.files,
                untaggedWav: null,
            }
        },
        handleStemsAdd({ name, base64 }) {
            this.files = {
                ...this.files,
                stems: {
                    name,
                    base64,
                },
            }
        },
        handleStemsRemove() {
            this.files = {
                ...this.files,
                stems: null,
            }
        },
        handleTaggedAdd({ name, base64 }) {
            this.files = {
                ...this.files,
                tagged: {
                    name,
                    base64,
                },
            }
        },
        handleTaggedRemove() {
            this.files = {
                ...this.files,
                tagged: null,
            }
        },
    },
}
</script>