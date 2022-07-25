<template>
    <div class="page page-kit-add-edit">
        <nav class="page-nav">
            <basic-button
                class="back-btn"
                variant="text"
                :to="{ name: 'accountSoundKits' }"
            >
                <i class="ico ico-back"></i>
                <span>Sound Kits</span>
            </basic-button>
        </nav>
        <LoadingSpinner class="page-loader" v-if="loading" />
        <div v-else>
            <div class="alert alert-success" v-if="showCreatedMessage">
                <strong>Created {{ kit.title }}!&nbsp;</strong>
                <basic-button variant="link">
                    View it
                </basic-button>
                or
                <basic-button
                    variant="link"
                    :to="{ name: 'accountSoundKitAdd' }"
                >
                    create another sound kit
                </basic-button>
            </div>
            <header class="page-header">
                <div class="left-col">
                    <h1 class="page-title">{{
                        isEditMode ? kit.title : 'Create Sound Kit'
                    }}</h1>
                </div>
                <div class="right-col">
                    <basic-button
                        class="cancel-btn"
                        variant="secondary"
                        size="md"
                        :disabled="saving"
                        :to="{ name: 'accountSoundKits' }"
                    >
                        Cancel
                    </basic-button>
                    <spinner-button
                        size="md"
                        :loading="saving"
                        @click="handleSaveClick"
                    >
                        Save
                    </spinner-button>
                </div>
            </header>
            <main class="page-body">
                <div class="left-col">
                    <base-card title="Kit Details" class="info-card">
                        <b-form-group label="Title">
                            <b-form-input
                                placeholder="e.g. My Kit"
                                v-model="$v.form.title.$model"
                                :state="!$v.form.title.$error"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                                <template v-if="!$v.form.title.required">
                                    Enter a title
                                </template>
                                <template v-else-if="!$v.form.title.isUnique">
                                    You already have a kit with this title, pick
                                    a new one.
                                </template>
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group label="Price">
                            <div class="money-input">
                                <Icon class="input-icon" icon="dollar" />
                                <input
                                    type="text"
                                    v-model="$v.form.price.$model"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': $v.form.price.$error,
                                    }"
                                    v-cleave="{
                                        numeral: true,
                                    }"
                                />
                            </div>
                            <b-form-invalid-feedback
                                :force-show="$v.form.price.$error"
                            >
                                Enter a price
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group label="Genre">
                            <BasicSelect
                                v-model="form.genreId"
                                placeholder="Select Genre"
                                :options="genres"
                                :reduce="genre => genre.id"
                                label="genre"
                            />
                        </b-form-group>
                        <b-form-group label="Tags(3)">
                            <TaggerInput
                                v-model="tag"
                                :tags="form.tags"
                                :class="{
                                    'is-invalid': $v.form.tags.$error,
                                }"
                                @tags-changed="handleTagsChange"
                            />
                            <b-form-invalid-feedback
                                :state="!$v.form.tags.$error"
                            >
                                Add 3 or more tags to help people find this kit
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group label="Description">
                            <textarea
                                class="form-control"
                                rows="4"
                                v-model="form.description"
                            ></textarea>
                        </b-form-group>
                    </base-card>
                    <base-card class="zip-card" title="Sound Kit ZIP File">
                        <drop-file
                            class="is-zip"
                            :class="{ 'is-invalid': $v.form.zipFile.$error }"
                            :filename="form.zipFile.name"
                            :src="form.zipFile.base64"
                            :acceptTypes="['.zip', '.rar']"
                            @add-file="handleZipFileAdd"
                            @remove-file="handleZipFileRemove"
                        >
                            <template v-slot:preview-body>
                                <div
                                    v-if="isZipFileAdded"
                                    class="preview-title"
                                    v-html="form.zipFile.name"
                                ></div>
                            </template>
                            <template v-slot:upload-section>
                                <i class="upload-icon"></i>
                                <div class="upload-msg">
                                    <div class="upload-msg-s">
                                        Add Zip File
                                    </div>
                                    <div class="upload-msg-l">
                                        Drop a ZIP file here or
                                        <u>browse for file</u>
                                    </div>
                                </div>
                            </template>
                        </drop-file>
                        <div class="files" v-if="fileCount">
                            <div class="file-count">
                                {{ fileCount }} samples
                            </div>
                            <ul class="file-list">
                                <li
                                    v-for="(filename, index) in filesPaginated"
                                    :key="index"
                                >
                                    <MiniAudioPlayer
                                        :src="
                                            `/audios/sound_kit_file/${user.id}/${kit.id}/${filename}`
                                        "
                                    />
                                    {{ filename }}
                                </li>
                            </ul>
                            <footer>
                                <basic-button
                                    v-if="showLoadMoreFilesBtn"
                                    variant="outline-light"
                                    size="sm"
                                    @click="handleLoadMoreFilesClick"
                                >
                                    Load More Samples
                                </basic-button>
                            </footer>
                        </div>
                    </base-card>
                    <base-card class="mp3-card" title="Demo MP3 File">
                        <drop-audio
                            :filename="form.mp3File.name"
                            :src="form.mp3File.base64"
                            :acceptTypes="['.mp3']"
                            @add-file="handleDemoFileAdd"
                            @remove-file="handleDemoFileRemove"
                        >
                            <template v-slot:preview-body>
                                <div
                                    v-if="isDemoFileAdded"
                                    class="preview-title"
                                    v-html="form.mp3File.name"
                                ></div>
                            </template>
                            <template v-slot:upload-section>
                                <i class="upload-icon"></i>
                                <div class="upload-msg">
                                    <div class="upload-msg-s">
                                        Add MP3 Preview File
                                    </div>
                                    <div class="upload-msg-l">
                                        Drop a preview MP3 here or
                                        <u>browse for file</u>
                                    </div>
                                </div>
                            </template>
                        </drop-audio>
                        <div
                            class="text-hint upload-hint"
                            v-if="!isDemoFileAdded"
                        >
                            Optional: Add a demo of your kit for customers to
                            preview prior to purchase.
                        </div>
                    </base-card>
                </div>
                <div class="right-col">
                    <div class="Card viz-card">
                        <header class="card-header">
                            <div class="card-title">
                                Visibility
                            </div>
                            <div class="viz-toggle">
                                <span class="toggle-label">
                                    {{ form.isPublic ? 'Public' : 'Private' }}
                                </span>
                                <TogglerButton v-model="form.isPublic" />
                            </div>
                        </header>
                        <b-form-group
                            v-show="form.scheduled"
                            label="Set Release Date"
                        >
                            <b-input-group class="date-input-group">
                                <DatePicker v-model="form.date" />
                                <TimePicker v-model="form.time" />
                            </b-input-group>
                        </b-form-group>
                        <basic-button
                            variant="link"
                            @click="handleScheduleToggle"
                        >
                            {{
                                form.scheduled
                                    ? 'Remove release date'
                                    : 'Set release date'
                            }}
                        </basic-button>
                    </div>
                    <div class="Card">
                        <drop-image
                            variant="inline"
                            msg-long="Drag artwork here or<br><u>browse for file</u>"
                            :src="form.coverArtBase64"
                            @add-file="handleImageAdd"
                            @remove-file="handleImageRemove"
                        >
                            <template v-slot:upload-controls>
                                <small
                                    class="text-hint"
                                    v-if="!form.coverArtBase64"
                                >
                                    Suggested Dimensions: 1000x1000
                                </small>
                            </template>
                        </drop-image>
                    </div>
                </div>
            </main>
            <footer class="page-footer">
                <basic-button
                    class="cancel-btn"
                    variant="secondary"
                    size="md"
                    :disabled="saving"
                    :to="{ name: 'accountSoundKits' }"
                >
                    Cancel
                </basic-button>
                <spinner-button
                    size="md"
                    :loading="saving"
                    @click="handleSaveClick"
                >
                    Save
                </spinner-button>
            </footer>
        </div>
    </div>
</template>

<script>
import { DropImage, DropFile, DropAudio } from '~/components/Uploader'
import { MiniAudioPlayer } from '~/components/Player'
import { api } from '~/services'
import { appConstants } from '~/constants'
import { mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import moment from 'moment'

const FILES_PAGE_SIZE = 5

export default {
    name: 'SoundKitAddEdit',
    components: {
        DropImage,
        DropFile,
        DropAudio,
        MiniAudioPlayer,
    },
    data() {
        return {
            loading: false,
            saving: false,
            showCreatedMessage: false,
            tag: '',
            files: [],
            filesCurrentPage: 1,
            kit: {},
            form: {
                title: null,
                price: null,
                genreId: null,
                description: null,
                coverArtBase64: null,
                tags: [],
                isPublic: false,
                scheduled: false,
                date: new Date(),
                time: '00:00:00',
                mp3File: {},
                zipFile: {},
            },
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
            genres: 'common/genres',
        }),
        isEditMode() {
            return !!this.kit.id
        },
        fileCount() {
            return this.files.length
        },
        filesPaginated() {
            return this.files.slice(0, this.filesCurrentPage * FILES_PAGE_SIZE)
        },
        showLoadMoreFilesBtn() {
            return this.filesPaginated.length < this.fileCount
        },
        isZipFileAdded() {
            return !!this.form.zipFile.base64
        },
        isDemoFileAdded() {
            return !!this.form.mp3File.base64
        },
    },
    validations: {
        form: {
            price: {
                required,
            },
            tags: {
                required,
                minLength: minLength(3),
            },
            zipFile: {
                required,
            },
            title: {
                required,
                async isUnique(value) {
                    if (!value) {
                        return true
                    }
                    const params = {
                        value,
                        trackType: 3,
                        userId: this.user.id,
                    }
                    if (this.isEditMode) {
                        params.audioId = this.kit.id
                    }
                    const { status } = await api.audios.getAvailability(params)
                    return status === 'success'
                },
            },
        },
    },
    async created() {
        this.loading = true

        const route = this.$route

        if (route.name === 'accountSoundKitEdit') {
            const kitId = route.params.id
            const kitResponse = await api.audios.getSoundKit(
                kitId,
                this.user.id
            )
            if (kitResponse.status !== 'success' || !kitResponse.data.length) {
                this.$router.push({ name: 'accountSoundKits' })
                this.$toast.error('Sound kit not found.')
                return
            }
            const kit = kitResponse.data[0]
            const form = {
                isPublic: kit.public == appConstants.visibilities.public,
                title: kit.title,
                price: kit.price,
                genreId: kit.genre_id,
                description: kit.description,
                coverArtBase64: kit.data_image,
                scheduled: kit.scheduled,
                date: kit.scheduled
                    ? new Date(kit.date + ' 00:00:00')
                    : new Date(),
                time: kit.scheduled ? kit.time : '00:00:00',
                tags: kit.tags
                    ? kit.tags.split(', ').map(tag => ({
                          text: tag,
                      }))
                    : [],
                mp3File: kit.tagged_file
                    ? {
                          name: kit.tagged_file_name,
                          base64: kit.data_tagged_file,
                      }
                    : {},
                zipFile: kit.track_stems
                    ? {
                          name: kit.track_stems_name,
                          base64: kit.data_track_stems,
                      }
                    : {},
            }
            this.form = { ...this.form, ...form }
            this.kit = kit
            this.files = [...kit.kit_files_name]
        }

        await this.$store.dispatch('common/loadGenres')

        this.loading = false
    },
    mounted() {
        this.showCreatedMessage = !!this.$route.query.c
    },
    methods: {
        handleTagsChange(tags) {
            this.form.tags = tags
        },
        handleScheduleToggle() {
            this.$v.form.$reset()
            this.form.scheduled = !this.form.scheduled
        },
        handleLoadMoreFilesClick() {
            this.filesCurrentPage++
        },
        handleImageAdd(file) {
            this.form.coverArtBase64 = file.base64
        },
        handleImageRemove() {
            this.form.coverArtBase64 = null
        },
        handleDemoFileAdd({ name, base64 }) {
            this.form.mp3File = {
                name,
                base64,
            }
        },
        handleDemoFileRemove() {
            this.form.mp3File = {}
        },
        async handleZipFileAdd({ name, base64 }) {
            this.form.zipFile = {
                name,
                base64,
            }
        },
        handleZipFileRemove() {
            this.form.zipFile = {}
            this.files = []
        },
        handleSaveClick() {
            this.$v.form.$touch()

            if (this.$v.form.title.$invalid) {
                this.$toast.error('Enter a title.')
                return
            }

            if (this.$v.form.price.$invalid) {
                this.$toast.error('Enter a price.')
                return
            }

            if (this.$v.form.tags.$invalid) {
                this.$toast.error(
                    'Add 3 or more tags to help people find this kit.'
                )
                return
            }

            if (this.$v.form.zipFile.$invalid) {
                this.$toast.error('Add ZIP file.')
                return
            }

            this.saving = true

            setTimeout(this.save, 500)
        },
        async save() {
            const { kit, form } = this

            const params = {
                user_id: this.user.id,
                title: form.title,
                price: form.price,
                genre_id: form.genreId,
                tags: form.tags.map(({ text }) => text).join(', '),
                description: form.description,
                track_type: 3,
                public: form.isPublic ? 1 : 2,
                scheduled: form.scheduled,
            }

            // Schedule
            if (form.scheduled) {
                params.date = moment(form.date).format('YYYY-MM-DD')
                params.time = form.time
            }

            // Cover art
            if (!this.isEditMode || form.coverArtBase64 !== kit.data_image) {
                params.image = form.coverArtBase64
            }

            // Files
            const { zipFile, mp3File } = form

            if (
                !this.isEditMode ||
                zipFile.name !== kit.track_stems_name ||
                zipFile.base64 !== kit.data_track_stems
            ) {
                params.track_stems = zipFile.base64 || null
                params.track_stems_name = zipFile.name || null
            }

            if (
                !this.isEditMode ||
                mp3File.name !== kit.tagged_file_name ||
                mp3File.base64 !== kit.data_tagged_file
            ) {
                params.tagged_file = mp3File.base64 || null
                params.tagged_file_name = mp3File.name || null
            }

            const { status, message, error, data } = this.isEditMode
                ? await this.$store.dispatch('me/updateSoundKit', {
                      id: kit.id,
                      params,
                  })
                : await this.$store.dispatch('me/createSoundKit', { params })

            if (status === 'success') {
                if (this.isEditMode) {
                    this.$router.replace(
                        {
                            name: 'accountSoundKitEdit',
                            params: {
                                id: data.id,
                            },
                            query: {
                                u: Date.now(),
                            },
                        },
                        () => {
                            this.$toast.success(message)
                        }
                    )
                } else {
                    this.$router.push({
                        name: 'accountSoundKitEdit',
                        params: {
                            id: data.id,
                        },
                        query: {
                            c: 1,
                        },
                    })
                }
            } else {
                this.$toast.error(error)
                this.saving = false
            }
        },
    },
}
</script>
