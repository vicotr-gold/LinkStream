<template>
    <div class="page page-beatpack-add-edit">
        <nav class="page-nav">
            <basic-button
                class="back-btn"
                variant="text"
                :to="{ name: 'accountBeatPacks' }"
            >
                <i class="ico ico-back"></i>
                <span>Beat Packs</span>
            </basic-button>
        </nav>
        <LoadingSpinner class="page-loader" v-if="loading" />
        <div v-else>
            <div class="alert alert-success" v-if="showCreatedMessage">
                <strong>Created {{ pack.title }}!&nbsp;</strong>
                <basic-button variant="link">
                    View it
                </basic-button>
                or
                <basic-button
                    variant="link"
                    :to="{ name: 'accountBeatPackAdd' }"
                >
                    create another beat pack
                </basic-button>
            </div>
            <header class="page-header">
                <div class="left-col">
                    <h1 class="page-title">
                        {{ isEditMode ? pack.title : 'Create Beat Pack' }}
                    </h1>
                </div>
                <div class="right-col">
                    <basic-button
                        class="cancel-btn"
                        variant="secondary"
                        size="md"
                        :disabled="saving"
                        :to="{ name: 'accountBeatPacks' }"
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
                    <base-card title="Beat Pack Details" class="info-card">
                        <b-form-group label="Title">
                            <b-form-input
                                placeholder="e.g. My Beat Pack"
                                v-model="$v.form.title.$model"
                                :state="!$v.form.title.$error"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                                <template v-if="!$v.form.title.required">
                                    Enter a title
                                </template>
                                <template v-else-if="!$v.form.title.isUnique">
                                    You already have a pack with this title,
                                    pick a new one.
                                </template>
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group label="License Type">
                            <BasicSelect
                                v-model="form.licenseId"
                                placeholder="Select License"
                                :class="{
                                    'is-invalid': $v.form.licenseId.$error,
                                }"
                                :options="licenses"
                                :reduce="license => license.id"
                                label="title"
                            />
                            <b-form-invalid-feedback
                                :force-show="$v.form.licenseId.$error"
                            >
                                Select a license
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
                                Add 3 or more tags to help people find this pack
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
                    <base-card title="Beats" class="beats-card">
                        <multi-select
                            placeholder="Search for Beats to add"
                            class="beats-multiselect"
                            v-model="form.beats"
                            :options="beats"
                        >
                            <template
                                v-slot:option-content="{ option, selected }"
                            >
                                <div class="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        class="custom-control-input"
                                        :checked="
                                            !!selected.find(
                                                ({ id }) => id == option.id
                                            )
                                        "
                                    />
                                    <label class="custom-control-label"></label>
                                </div>
                                <div class="option-cover">
                                    <span
                                        class="lock-overlay"
                                        v-if="option.isPrivate"
                                    ></span>
                                    <img
                                        :src="option.coverart"
                                        :alt="option.title"
                                    />
                                </div>
                                <div>
                                    <h4 class="option-title">
                                        {{ option.title }}
                                    </h4>
                                    <small>
                                        {{ genreLabelById(option.genre_id) }}
                                    </small>
                                </div>
                            </template>
                            <template v-slot:select-empty="{ options }">
                                <span v-if="options.length">
                                    No matching beats.
                                </span>
                                <span v-else>
                                    You don't have any beats.
                                    <br />
                                    <basic-button
                                        variant="link"
                                        :to="{ name: 'accountBeatAdd' }"
                                    >
                                        Add a Beat
                                    </basic-button>
                                </span>
                            </template>
                        </multi-select>
                        <BeatList
                            :beats="form.beats"
                            @remove-item="handleBeatRemove"
                            @reorder-items="handleBeatsReorder"
                        />
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
                    :to="{ name: 'accountBeatPacks' }"
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
import BeatList from '~/components/Account/Tracks/BeatPacks/BeatList'
import { DropImage } from '~/components/Uploader'
import { api } from '~/services'
import { appConstants } from '~/constants'
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
    name: 'BeatPackAddEdit',
    components: {
        BeatList,
        DropImage,
    },
    data() {
        return {
            loading: false,
            saving: false,
            showCreatedMessage: false,
            pack: {},
            tag: '',
            form: {
                title: null,
                licenseId: null,
                price: null,
                genreId: null,
                description: null,
                tags: [],
                coverArtBase64: null,
                beats: [],
                isPublic: false,
                scheduled: false,
                date: new Date(),
                time: '00:00:00',
            },
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
            genres: 'common/genres',
            licenses: 'me/licenses',
            beats: 'me/beats',
            genreLabelById: 'common/genreLabelById',
        }),
        isEditMode() {
            return !!this.pack.id
        },
    },
    validations: {
        form: {
            price: {
                required,
            },
            licenseId: {
                required,
            },
            tags: {
                required,
                minLength: minLength(3),
            },
            title: {
                required,
                async isUnique() {
                    return true
                },
            },
        },
    },
    async created() {
        this.loading = true

        const route = this.$route

        if (route.name === 'accountBeatPackEdit') {
            const packId = route.params.id
            const packResponse = await api.albums.getAlbum(packId, this.user.id)
            if (
                packResponse.status !== 'success' ||
                !packResponse.data.length
            ) {
                this.$router.push({ name: 'accountBeatPacks' })
                this.$toast.error('Beat pack not found.')
                return
            }
            await this.$store.dispatch('common/loadGenres')
            await this.$store.dispatch('me/loadLicenses')
            await this.$store.dispatch('me/loadBeats')
            const pack = packResponse.data[0]
            const form = {
                isPublic: pack.public == appConstants.visibilities.public,
                title: pack.title,
                price: pack.price,
                genreId: pack.genre_id,
                licenseId: pack.license_id,
                description: pack.description,
                coverArtBase64: pack.data_image,
                scheduled: pack.scheduled,
                date: pack.scheduled
                    ? new Date(pack.date + ' 00:00:00')
                    : new Date(),
                time: pack.scheduled ? pack.time : '00:00:00',
                tags: pack.tags
                    ? pack.tags.split(', ').map(tag => ({
                          text: tag,
                      }))
                    : [],
                beats: [],
            }
            if (Array.isArray(pack.beats)) {
                pack.beats.forEach(({ id_audio }) => {
                    const beat = this.beats.find(({ id }) => id == id_audio)
                    beat && form.beats.push(beat)
                })
            }
            this.form = { ...this.form, ...form }
            this.pack = pack
        } else {
            await this.$store.dispatch('common/loadGenres')
            await this.$store.dispatch('me/loadLicenses')
            await this.$store.dispatch('me/loadBeats')
        }

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
        handleImageAdd(file) {
            this.form.coverArtBase64 = file.base64
        },
        handleImageRemove() {
            this.form.coverArtBase64 = null
        },
        handleBeatRemove(index) {
            this.form.beats.splice(index, 1)
        },
        handleBeatsReorder(beats) {
            this.form.beats = beats
        },
        handleSaveClick() {
            this.$v.form.$touch()

            if (this.$v.form.title.$invalid) {
                this.$toast.error('Enter a title.')
                return
            }

            if (this.$v.form.licenseId.$invalid) {
                this.$toast.error('Select a license.')
                return
            }

            if (this.$v.form.price.$invalid) {
                this.$toast.error('Enter a price.')
                return
            }

            if (this.$v.form.tags.$invalid) {
                this.$toast.error(
                    'Add 3 or more tags to help people find this beat pack.'
                )
                return
            }

            this.saving = true

            setTimeout(this.save, 500)
        },
        async save() {
            const { pack, form } = this

            const params = {
                user_id: this.user.id,
                title: form.title,
                price: form.price,
                genre_id: form.genreId,
                license_id: form.licenseId,
                tags: form.tags.map(({ text }) => text).join(', '),
                description: form.description,
                public: form.isPublic ? 1 : 2,
                scheduled: form.scheduled,
                beats: JSON.stringify(form.beats.map(beat => beat.id)),
            }

            if (form.scheduled) {
                params.date = moment(form.date).format('YYYY-MM-DD')
                params.time = form.time
            }

            if (!this.isEditMode || form.coverArtBase64 !== pack.data_image) {
                params.image = form.coverArtBase64
            }

            const { status, message, error, data } = this.isEditMode
                ? await this.$store.dispatch('me/updateBeatPack', {
                      id: pack.id,
                      params,
                  })
                : await this.$store.dispatch('me/createBeatPack', { params })

            if (status === 'success') {
                if (this.isEditMode) {
                    this.$router.replace(
                        {
                            name: 'accountBeatPackEdit',
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
                        name: 'accountBeatPackEdit',
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