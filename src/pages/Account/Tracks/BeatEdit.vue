<template>
    <div class="page page-beat-edit">
        <nav class="page-nav">
            <basic-button
                class="back-btn"
                variant="text"
                :to="{ name: 'accountBeats' }"
            >
                <i class="ico ico-back"></i>
                <span>Beats</span>
            </basic-button>
        </nav>
        <LoadingSpinner class="page-loader" v-if="isLoading" />
        <div v-else>
            <header class="page-header">
                <div class="left-col">
                    <h1 class="page-title">{{ beat.title }}</h1>
                    <div class="page-preview">
                        <span>
                            <span class="text-light">link.stream/</span
                            >{{ beat.url_user }}/beats/{{ beat.url_title }}
                        </span>
                        <basic-button
                            variant="outline-light"
                            size="xs"
                            :to="{
                                name: 'userBeats',
                                params: {
                                    username: beat.url_user,
                                    title: beat.url_title,
                                },
                            }"
                        >
                            Preview
                        </basic-button>
                    </div>
                </div>
                <div class="right-col">
                    <basic-button
                        class="cancel-btn"
                        variant="secondary"
                        size="md"
                        :disabled="isSaving"
                        :to="{ name: 'accountBeats' }"
                    >
                        Cancel
                    </basic-button>
                    <spinner-button
                        size="md"
                        :loading="isSaving"
                        @click="handleSaveClick"
                    >
                        Save
                    </spinner-button>
                </div>
            </header>
            <main class="page-body">
                <div class="left-col">
                    <!-- Info Card -->
                    <base-card title="Beat Details" class="info-card">
                        <b-form-group label="Title">
                            <b-form-input
                                placeholder="e.g. My Beat"
                                v-model="$v.form.title.$model"
                                :state="!$v.form.title.$error"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                                <template v-if="!$v.form.title.required">
                                    Enter the title
                                </template>
                                <template v-else-if="!$v.form.title.isUnique">
                                    You already have a beat with this title,
                                    pick a new one.
                                </template>
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group label="Primary Genre">
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
                                :class="{
                                    'is-invalid': $v.form.tags.$error,
                                }"
                                :tags="form.tags"
                                @tags-changed="handleTagsChange"
                            />
                            <b-form-invalid-feedback
                                :state="!$v.form.tags.$error"
                            >
                                Add 3 or more tags to help people find this beat
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="BPM">
                                    <b-form-input
                                        type="number"
                                        v-model="form.bpm"
                                    ></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Key">
                                    <BasicSelect
                                        v-model="form.keyId"
                                        placeholder="Select"
                                        :options="audioKeys"
                                        :reduce="key => key.id"
                                        label="name"
                                    />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                    </base-card>

                    <!-- Files Card -->
                    <base-card title="Files">
                        <DropAudio
                            title="Untagged .MP3"
                            :class="{
                                'is-invalid': $v.form.files.untaggedMp3.$error,
                            }"
                            :src="form.files.untaggedMp3.base64"
                            :filename="form.files.untaggedMp3.name"
                            :acceptTypes="['.mp3']"
                            @add-file="handleUntaggeMp3Add"
                            @remove-file="handleUntaggedMp3Remove"
                        />
                        <DropAudio
                            title="Untagged .WAV"
                            :class="{
                                'is-invalid': $v.form.files.untaggedWav.$error,
                            }"
                            :src="form.files.untaggedWav.base64"
                            :filename="form.files.untaggedWav.name"
                            :acceptTypes="['.wav']"
                            @add-file="handleUntaggedWavAdd"
                            @remove-file="handleUntaggedWavRemove"
                        />
                        <DropAudio
                            title="Tagged Streaming File (.MP3 or .WAV)"
                            :src="form.files.tagged.base64"
                            :filename="form.files.tagged.name"
                            @add-file="handleTaggedAdd"
                            @remove-file="handleTaggedRemove"
                        />
                        <DropFile
                            title="Track Stems .ZIP (or .RAR)"
                            :class="{
                                'is-invalid': $v.form.files.stems.$error,
                            }"
                            :acceptTypes="['.rar', '.zip']"
                            :src="form.files.stems.base64"
                            :filename="form.files.stems.name"
                            @add-file="handleStemsAdd"
                            @remove-file="handleStemsRemove"
                        />
                    </base-card>

                    <!-- Licenses Card -->
                    <base-card title="Licensing">
                        <LicenseCard
                            v-for="license in licenses"
                            :license="license"
                            :key="license.id"
                            :checked="
                                form.selectedLicenseIds.indexOf(license.id) > -1
                            "
                            @updated="handleLicenseUpdated"
                            @checked="handleLicenseChecked"
                            @unchecked="handleLicenseUnchecked"
                        />
                    </base-card>

                    <!-- Beat Pack Card -->
                    <base-card title="Add to Beat Pack">
                        <beat-packs-multi-select
                            placeholder="Search for beat packs"
                            v-model="form.trackPack"
                        />
                    </base-card>

                    <!-- Marketing Card -->
                    <base-card title="Free downloads" class="marketing-card">
                        <div
                            class="custom-control custom-checkbox"
                            v-for="option in freeDls"
                            :key="option.id"
                        >
                            <input
                                type="checkbox"
                                class="custom-control-input"
                                v-model="form.selectedFreeDlIds"
                                :value="option.id"
                                :checked="
                                    form.selectedFreeDlIds.indexOf(
                                        option.id
                                    ) !== -1
                                "
                                :id="`freeCheck${option.id}`"
                            />
                            <label
                                class="custom-control-label"
                                :for="`freeCheck${option.id}`"
                            >
                                {{ option.title }}
                            </label>
                        </div>
                    </base-card>

                    <!-- Collabs Card -->
                    <base-card title="Collaborators">
                        <div class="collabs">
                            <div class="collabs-grid">
                                <div
                                    class="collab-row"
                                    v-for="(collab, index) in form.collabs"
                                    :key="index"
                                >
                                    <div class="collab-col user-col">
                                        <label>Collaborator</label>
                                        <div class="mini-profile">
                                            <UserAvatar :user="collab.user" />
                                            {{
                                                collab.user.name | truncate(14)
                                            }}
                                            {{
                                                collab.user.id == user.id
                                                    ? '(you)'
                                                    : ''
                                            }}
                                        </div>
                                    </div>
                                    <div class="collab-col profit-col">
                                        <label>Profit %</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            :readonly="index == 0"
                                            :value="collab.profit"
                                            @keyup="
                                                handleCollabProfitInput(
                                                    collab,
                                                    $event
                                                )
                                            "
                                        />
                                    </div>
                                    <div class="collab-col pub-col">
                                        <label>Publishing %</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            :readonly="index === 0"
                                            :value="collab.publishing"
                                            @keyup="
                                                handleCollabPublishingInput(
                                                    collab,
                                                    $event
                                                )
                                            "
                                        />
                                    </div>
                                    <div
                                        class="collab-col remove-col"
                                        v-if="index > 0"
                                    >
                                        <IconButton
                                            icon="close"
                                            class="remove-icon"
                                            @click="
                                                handleCollabRemoveClick(index)
                                            "
                                        />
                                        <basic-button
                                            variant="link"
                                            class="remove-btn"
                                            @click="
                                                handleCollabRemoveClick(index)
                                            "
                                        >
                                            Remove Collaborator
                                        </basic-button>
                                    </div>
                                </div>
                            </div>
                            <basic-button
                                variant="text"
                                class="add-btn"
                                @click="showCollabSearchModal"
                            >
                                <Icon icon="plus" />
                                Add Collaborator
                            </basic-button>
                        </div>
                    </base-card>
                </div>
                <div class="right-col">
                    <!-- Visibility Card -->
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
                                    ? 'Remove schedule'
                                    : 'Schedule release'
                            }}
                        </basic-button>
                    </div>

                    <!-- Image Card -->
                    <div class="Card">
                        <DropImage
                            variant="inline"
                            msg-long="Drag artwork here or<br><u>browse for file</u>"
                            :src="form.coverArtBase64"
                            @add-file="handleImageAdd"
                            @remove-file="handleImageRemove"
                        />
                    </div>
                </div>
            </main>
            <footer class="page-footer">
                <div class="left-col">
                    <IconButton
                        icon="trash-sm"
                        title="Delete"
                        @click="handleDeleteClick"
                    />
                </div>
                <div class="right-col">
                    <basic-button
                        class="cancel-btn"
                        variant="secondary"
                        size="md"
                        :disabled="isSaving"
                        :to="{ name: 'accountBeats' }"
                    >
                        Cancel
                    </basic-button>
                    <spinner-button
                        size="md"
                        :loading="isSaving"
                        @click="handleSaveClick"
                    >
                        Save
                    </spinner-button>
                </div>
            </footer>
        </div>
        <UserInviteModal />
        <UserSearchModal />
    </div>
</template>

<script>
import { LicenseCard } from '~/components/Account/Tracks/AddTrackWizard'
import { DropAudio, DropFile, DropImage } from '~/components/Uploader'
import { UserInviteModal, UserSearchModal } from '~/components/Modal'
import BeatPacksMultiSelect from '~/components/Account/Tracks/Beats/BeatPacksMultiSelect'
import { collabsProfitFormMixin } from '~/mixins/tracks/collabsProfitForm'
import { api } from '~/services'
import { appConstants } from '~/constants'
import { mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import moment from 'moment'

const STATUS_IDLE = 'idle'
const STATUS_LOADING = 'loading'
const STATUS_SAVING = 'saving'

export default {
    name: 'BeatEdit',
    mixins: [collabsProfitFormMixin],
    components: {
        DropAudio,
        DropFile,
        DropImage,
        LicenseCard,
        UserInviteModal,
        UserSearchModal,
        BeatPacksMultiSelect,
    },
    data() {
        return {
            tag: '',
            status: STATUS_IDLE,
            beat: {},
            form: {},
            licenses: [],
            freeDls: [...appConstants.marketingOptions],
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
            genres: 'common/genres',
            audioKeys: 'common/audioKeys',
            packs: 'me/relatedBeatPacks',
        }),
        isLoading() {
            return this.status === STATUS_LOADING
        },
        isSaving() {
            return this.status === STATUS_SAVING
        },
        selectedLicenses() {
            return this.licenses.filter(
                ({ id }) => this.form.selectedLicenseIds.indexOf(id) !== -1
            )
        },
        selectedFreeDls() {
            return this.freeDls.filter(
                ({ id }) => this.form.selectedFreeDlIds.indexOf(id) !== -1
            )
        },
    },
    watch: {
        form() {
            this.$v.form.$touch()
        },
    },
    validations() {
        const files = {
            stems: {},
            untaggedMp3: {},
            untaggedWav: {},
        }

        this.selectedLicenses.forEach(({ mp3, wav, trackout_stems }) => {
            if (mp3 === '1') {
                files.untaggedMp3 = { required }
            }
            if (wav === '1') {
                files.untaggedWav = { required }
            }
            if (trackout_stems === '1') {
                files.stems = { required }
            }
        })

        return {
            form: {
                files,
                tags: {
                    required,
                    minLength: minLength(3),
                },
                title: {
                    required,
                    async isUnique(value) {
                        if (!value) {
                            return true
                        }
                        const { status } = await api.audios.getAvailability({
                            value,
                            userId: this.user.id,
                            audioId: this.beat.id,
                        })
                        return status === 'success'
                    },
                },
            },
        }
    },
    mounted() {
        this.$bus.$on('modal.userSearch.userSelected', this.handleCollabAdd)
        this.$bus.$on('modal.userInvite.userInvited', this.handleCollabAdd)
    },
    async created() {
        this.status = STATUS_LOADING

        const beatId = this.$route.params.id
        const beatResponse = await api.audios.getBeat(beatId, this.user.id)

        if (beatResponse.status !== 'success' || !beatResponse.data.length) {
            this.$router.push({ name: 'accountBeats' })
            this.$toast.error('Beat not found.')
            return
        }

        const beat = beatResponse.data[0]

        await this.$store.dispatch('common/loadGenres')
        await this.$store.dispatch('common/loadAudioKeys')
        await this.$store.dispatch('me/loadLicenses')

        const licenses = this.$store.getters['me/licenses']

        if (!licenses.length) {
            this.$router.push({ name: 'accountBeats' })
            this.$toast.error('Licenses not found.')
            return
        }
        const form = {
            title: beat.title,
            genreId: beat.genre_id || null,
            bpm: beat.bpm,
            keyId: beat.key_id || null,
            coverArtBase64: beat.data_image,
            isPublic: beat.public == appConstants.visibilities.public,
            scheduled: beat.scheduled,
            date: beat.scheduled
                ? new Date(beat.date + ' 00:00:00')
                : new Date(),
            time: beat.scheduled ? beat.time : '00:00:00',
            tags: beat.tags
                ? beat.tags.split(', ').map(tag => ({
                      text: tag,
                  }))
                : [],
            selectedLicenseIds: [],
            selectedFreeDlIds: Array.isArray(beat.marketing)
                ? beat.marketing.map(({ marketing_id }) => marketing_id)
                : [],
            collabs: Array.isArray(beat.collaborators)
                ? beat.collaborators.map(
                      ({
                          user_id,
                          user_name,
                          data_image,
                          profit,
                          publishing,
                      }) => ({
                          profit,
                          publishing,
                          user: {
                              id: user_id,
                              name: user_name,
                              photo: data_image,
                          },
                      })
                  )
                : [],
            files: {
                stems: beat.data_track_stems
                    ? {
                          name: beat.track_stems_name,
                          base64: beat.data_track_stems,
                      }
                    : {},
                tagged: beat.data_tagged_file
                    ? {
                          name: beat.tagged_file_name,
                          base64: beat.data_tagged_file,
                      }
                    : {},
                untaggedMp3: beat.data_untagged_mp3
                    ? {
                          name: beat.untagged_mp3_name,
                          base64: beat.data_untagged_mp3,
                      }
                    : {},
                untaggedWav: beat.data_untagged_wav
                    ? {
                          name: beat.untagged_wav_name,
                          base64: beat.data_untagged_wav,
                      }
                    : {},
            },
            trackPack: []
        }

        if (Array.isArray(beat.beat_packs)) {
            beat.beat_packs.forEach(({ id_album }) => {
                const pack = this.packs.find(({ id }) => id == id_album)
                pack && form.trackPack.push(pack)
            })
        }
        this.form = form
        this.beat = beat
        this.licenses = licenses

        // Merge beat licenses into licenses
        if (Array.isArray(beat.licenses) && beat.licenses.length) {
            this.licenses = licenses.map(license => {
                const beatLicense = beat.licenses.find(
                    ({ license_id }) => license_id == license.id
                )
                beatLicense &&
                    form.selectedLicenseIds.push(beatLicense.license_id)
                return {
                    ...license,
                    price: beatLicense ? beatLicense.price : license.price,
                }
            })
        }

        this.status = STATUS_IDLE
    },
    methods: {
        showCollabSearchModal() {
            this.$bus.$emit('modal.userSearch.open')
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
        handleTagsChange(tags) {
            this.form.tags = tags
        },
        handleLicenseChecked(license) {
            const index = this.form.selectedLicenseIds.indexOf(license.id)
            index === -1 && this.form.selectedLicenseIds.push(license.id)
        },
        handleLicenseUnchecked(license) {
            const index = this.form.selectedLicenseIds.indexOf(license.id)
            this.form.selectedLicenseIds.splice(index, 1)
        },
        handleLicenseUpdated(license) {
            const licenseIndex = this.licenses.findIndex(
                ({ id }) => id == license.id
            )
            this.licenses.splice(licenseIndex, 1, license)
        },
        handleUntaggeMp3Add({ name, base64 }) {
            this.form.files.untaggedMp3 = {
                name,
                base64,
            }
        },
        handleUntaggedMp3Remove() {
            this.form.files.untaggedMp3 = {}
        },
        handleUntaggedWavAdd({ name, base64 }) {
            this.form.files.untaggedWav = {
                name,
                base64,
            }
        },
        handleUntaggedWavRemove() {
            this.form.files.untaggedWav = {}
        },
        handleStemsAdd({ name, base64 }) {
            this.form.files.stems = {
                name,
                base64,
            }
        },
        handleStemsRemove() {
            this.form.files.stems = {}
        },
        handleTaggedAdd({ name, base64 }) {
            this.form.files.tagged = {
                name,
                base64,
            }
        },
        handleTaggedRemove() {
            this.form.files.tagged = {}
        },
        async handleDeleteClick() {
            this.$alert.confirm({
                title: 'Delete beat?',
                message: 'This beat and its data will be permanently deleted.',
                onOk: async () => {
                    const {
                        status,
                        message,
                        error,
                    } = await this.$store.dispatch('me/deleteBeat', this.beat)
                    if (status === 'success') {
                        this.$router.push({ name: 'accountBeats' })
                        this.$toast.success(message)
                    } else {
                        this.$toast.error(error)
                    }
                },
            })
        },
        handleSaveClick() {
            this.$v.form.$touch()

            if (!this.$v.form.title.required) {
                this.$toast.error('Enter the title.')
                return
            }

            if (!this.$v.form.title.isUnique) {
                this.$toast.error(
                    'You already have a beat with that title, pick a new one.'
                )
                return
            }

            if (this.$v.form.tags.$invalid) {
                this.$toast.error(
                    'Add 3 or more tags to help people find this beat.'
                )
                return
            }

            if (!this.form.selectedLicenseIds.length) {
                this.$toast.error('Pick one or more licenses.')
                return
            }

            if (this.$v.form.files.$invalid) {
                this.$toast.error('Add required files.')
                return
            }

            this.status = STATUS_SAVING

            setTimeout(this.save, 500)
        },
        async save() {
            const { beat, form } = this

            const params = {
                user_id: this.user.id,
                title: form.title,
                bpm: form.bpm,
                key: form.keyId,
                genre_id: form.genreId,
                tags: form.tags.map(({ text }) => text).join(', '),
                public: form.isPublic ? 1 : 2,
                scheduled: form.scheduled,
                collaborators: form.collabs.map(
                    ({ user, profit, publishing }) => {
                        return {
                            user_id: user.id,
                            profit,
                            publishing,
                        }
                    }
                ),
                licenses: this.selectedLicenses.map(
                    ({ id, price, status_id }) => {
                        return {
                            license_id: id,
                            price,
                            status_id,
                        }
                    }
                ),
                marketing: this.selectedFreeDls.map(({ id }) => {
                    return {
                        marketing_id: id,
                        connect_id: '',
                    }
                }),
                beat_packs: JSON.stringify(form.trackPack.map(pack => pack.id))
            }

            // Schedule
            if (form.scheduled) {
                params.date = moment(form.date).format('YYYY-MM-DD')
                params.time = form.time
            }

            // Cover art
            if (form.coverArtBase64 !== beat.data_image) {
                params.image = form.coverArtBase64
            }

            // Files
            const { stems, tagged, untaggedMp3, untaggedWav } = form.files

            if (
                stems.name !== beat.track_stems_name ||
                stems.base64 !== beat.data_track_stems
            ) {
                params.track_stems = stems.base64 || null
                params.track_stems_name = stems.name || null
            }

            if (
                tagged.name !== beat.tagged_file_name ||
                tagged.base64 !== beat.data_tagged_file
            ) {
                params.tagged_file = tagged.base64 || null
                params.tagged_file_name = tagged.name || null
            }

            if (
                untaggedMp3.name !== beat.untagged_mp3_name ||
                untaggedMp3.base64 !== beat.data_untagged_mp3
            ) {
                params.untagged_mp3 = untaggedMp3.base64 || null
                params.untagged_mp3_name = untaggedMp3.name || null
            }

            if (
                untaggedWav.name !== beat.untagged_wav_name ||
                untaggedWav.base64 !== beat.data_untagged_wav
            ) {
                params.untagged_wav = untaggedWav.base64 || null
                params.untagged_wav_name = untaggedWav.name || null
            }

            params.licenses = JSON.stringify(params.licenses)
            params.collaborators = JSON.stringify(params.collaborators)
            params.marketing = JSON.stringify(params.marketing)
            
            const { status, message, error } = await this.$store.dispatch(
                'me/updateBeat',
                {
                    id: beat.id,
                    params,
                }
            )

            if (status === 'success') {
                this.$toast.success(message)
                this.$router.push({ name: 'accountBeats' })
            } else {
                this.$toast.error(error)
                this.status = STATUS_IDLE
            }
        },
    },
}
</script>
