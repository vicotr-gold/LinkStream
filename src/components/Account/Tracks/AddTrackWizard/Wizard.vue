<template>
    <div class="fwz" :class="`is-step-${step}`">
        <header class="fwz-counter">
            Step {{ stepIndex }} / {{ numSteps - 1 }}
        </header>
        <WizardTabs
            v-show="stepIndex > 0"
            :tabs="tabs"
            :activeStepName="step"
            :activeStepIndex="stepIndex"
        />
        <LoadingSpinner class="page-loader" v-if="loading" />
        <main v-else>
            <!-- STEP - TRACK TYPE -->
            <wizard-step v-show="isStepType" class="type-step">
                <div class="Card">
                    <Icon icon="beat" />
                    <h4 class="card-title">Upload a Beat</h4>
                    <div class="card-text">
                        Generally short music tracks created
                        <br />
                        by producers. Usually intended to be
                        <br />
                        licensed by recording artists and
                        <br />
                        songwriters for use in commercially
                        <br />
                        released songs. Beats can be sold
                        <br />
                        individually or as part of a beat pack.
                    </div>
                    <basic-button @click="handleAddBeatClick">
                        Get Started
                    </basic-button>
                </div>
                <div class="Card">
                    <Icon icon="song" />
                    <h4 class="card-title">Upload a Song</h4>
                    <div class="card-text">
                        Commonly released by recording
                        <br />
                        artists and songwriters and are
                        <br />
                        considered a finished musical
                        <br />
                        product intended for commercial
                        <br />
                        release. Songs can be single releases
                        <br />
                        or part of an album or playlist.
                    </div>
                    <basic-button @click="handleAddSongClick">
                        Get Started
                    </basic-button>
                </div>
            </wizard-step>

            <!-- STEP - TRACK INFO -->
            <wizard-step
                v-show="isStepInfo"
                class="info-step"
                :title="isSong ? 'Song info' : 'Beat info'"
            >
                <div class="left-col">
                    <drop-image
                        msg-long="Drag artwork here or<br><u>browse for file</u>"
                        msg-short="Add Artwork"
                        :src="coverArtBase64"
                        @add-file="handleImageAdd"
                        @remove-file="handleImageRemove"
                    >
                        <template v-slot:upload-controls>
                            <small class="text-hint" v-if="!coverArtBase64">
                                Suggested Dimensions: 1000x1000
                            </small>
                        </template>
                    </drop-image>
                </div>
                <InfoBlock class="right-col" v-if="isStepInfo" />
            </wizard-step>

            <!-- STEP - LICENSE TYPES -->
            <wizard-step
                v-show="isStepLicenses"
                title="License types"
                class="licenses-step"
            >
                <LicensesBlock v-if="isStepLicenses" />
            </wizard-step>

            <!-- STEP - UPLOAD FILES -->
            <wizard-step
                v-show="isStepFiles"
                title="Upload files"
                subtitle="Add files to deliver when the license for this track is purchased"
                class="files-step"
            >
                <FilesBlock v-if="isStepFiles" />
            </wizard-step>

            <!-- STEP - MARKETING -->
            <wizard-step
                v-show="isStepMarketing"
                title="Free downloads"
                subtitle="Build your audience by allowing free MP3 downloads for social follows, email and SMS subscribes"
                class="marketing-step"
            >
                <MarketingBlock v-if="isStepMarketing" />
            </wizard-step>

            <!-- STEP - REVIEW -->
            <wizard-step
                v-show="isStepReview"
                :title="isSong ? 'Review song' : 'Review beat'"
                class="review-step"
            >
                <div class="left-col">
                    <div class="Card">
                        <DropImage
                            variant="inline"
                            msg-long="Drag artwork here or<br><u>browse for file</u>"
                            :src="coverArtBase64"
                            @add-file="handleImageAdd"
                            @remove-file="handleImageRemove"
                        />
                    </div>
                </div>
                <ReviewBlock class="right-col" v-if="isStepReview" />
            </wizard-step>

            <footer class="fwz-pager" v-show="stepIndex > 0">
                <basic-button
                    variant="secondary"
                    class="fwz-prev-btn"
                    :disabled="saving"
                    @click="handlePrevClick"
                >
                    Back
                </basic-button>
                <spinner-button
                    class="fwz-next-btn"
                    :loading="saving"
                    @click="handleNextClick"
                >
                    {{ isStepReview ? 'Save' : 'Next' }}
                </spinner-button>
            </footer>
        </main>
    </div>
</template>

<script>
import WizardStep from './WizardStep'
import WizardTabs from './WizardTabs'
import InfoBlock from './Block/InfoBlock'
import LicensesBlock from './Block/LicensesBlock'
import FilesBlock from './Block/FilesBlock'
import MarketingBlock from './Block/MarketingBlock'
import ReviewBlock from './Block/ReviewBlock'
import { DropImage } from '~/components/Uploader'
import { appConstants } from '~/constants'
import { scrollToTop } from '~/utils'
import { mapGetters } from 'vuex'
import moment from 'moment'

const STEP_TYPE = 'type'
const STEP_INFO = 'info'
const STEP_LICENSES = 'licenses'
const STEP_FILES = 'files'
const STEP_MARKETING = 'marketing'
const STEP_REVIEW = 'review'

const steps = [
    STEP_TYPE,
    STEP_INFO,
    STEP_LICENSES,
    STEP_FILES,
    STEP_MARKETING,
    STEP_REVIEW,
]

const tabs = [
    {
        text: 'Beat Info',
        step: STEP_INFO,
    },
    {
        text: 'Licenses',
        step: STEP_LICENSES,
    },
    {
        text: 'Upload Files',
        step: STEP_FILES,
    },
    {
        text: 'Marketing',
        step: STEP_MARKETING,
    },
    {
        text: 'Review',
        step: STEP_REVIEW,
    },
]

export default {
    name: 'AddTrackWizard',
    components: {
        WizardTabs,
        WizardStep,
        InfoBlock,
        LicensesBlock,
        FilesBlock,
        MarketingBlock,
        ReviewBlock,
        DropImage,
    },
    data() {
        return {
            stepIndex: 1,
            saving: false,
            loading: false,
            coverArtBase64: null,
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
            isSong: 'trackAddWizard/isSong',
        }),
        step() {
            return steps[this.stepIndex]
        },
        numSteps() {
            return steps.length
        },
        tabs() {
            tabs[0].text = this.isSong ? 'Song info' : 'Beat info'
            return tabs
        },
        isStepType() {
            return this.step === STEP_TYPE
        },
        isStepInfo() {
            return this.step === STEP_INFO
        },
        isStepLicenses() {
            return this.step === STEP_LICENSES
        },
        isStepFiles() {
            return this.step === STEP_FILES
        },
        isStepMarketing() {
            return this.step === STEP_MARKETING
        },
        isStepReview() {
            return this.step === STEP_REVIEW
        },
    },
    watch: {
        step() {
            this.$bus.$off('wz.nextClick')
            this.$bus.$off('wz.prevClick')
            this.$bus.$off('wz.saveClick')
            scrollToTop()
        },
    },
    async created() {
        this.loading = true
        await this.$store.dispatch('trackAddWizard/loadWizard')
        this.$store.dispatch('trackAddWizard/updateForm', {
            collabs: [
                {
                    profit: 100,
                    publishing: 100,
                    user: {
                        id: this.user.id,
                        name: this.user.user_name,
                        photo: this.user.photo,
                    },
                },
            ],
        })
        this.loading = false
    },
    methods: {
        goToStep(index) {
            this.stepIndex = index
        },
        next() {
            if (this.stepIndex < this.numSteps - 1) {
                this.goToStep(this.stepIndex + 1)
            }
        },
        prev() {
            if (this.stepIndex > 0) {
                this.goToStep(this.stepIndex - 1)
            }
        },
        handlePrevClick() {
            this.$bus.$emit('wz.prevClick')
            this.prev()
        },
        handleNextClick() {
            switch (this.step) {
                case STEP_INFO:
                case STEP_LICENSES:
                case STEP_FILES:
                case STEP_MARKETING:
                    this.$bus.$emit('wz.nextClick', {
                        onSuccess: this.next,
                    })
                    return
                case STEP_REVIEW:
                    this.$bus.$emit('wz.saveClick', {
                        onSuccess: this.handleSaveClick,
                    })
                    return
                default:
                    this.next()
            }
        },
        handleAddBeatClick() {
            this.$store.dispatch('trackAddWizard/updateForm', {
                trackType: appConstants.tracks.types.beat,
            })
            this.next()
        },
        handleAddSongClick() {
            this.$store.dispatch('trackAddWizard/updateForm', {
                trackType: appConstants.tracks.types.song,
            })
            this.next()
        },
        handleImageAdd({ base64 }) {
            this.coverArtBase64 = base64
            this.$store.dispatch('trackAddWizard/updateForm', {
                coverArtBase64: base64,
            })
        },
        handleImageRemove() {
            this.coverArtBase64 = null
            this.$store.dispatch('trackAddWizard/updateForm', {
                coverArtBase64: null,
            })
        },
        handleSaveClick() {
            this.saving = true
            setTimeout(this.save, 500)
        },
        async save() {
            const { form } = this.$store.state.trackAddWizard

            const params = {
                user_id: this.user.id,
                track_type: form.trackType,
                title: form.title,
                bpm: form.bpm,
                key_id: form.key ? form.key.id : null,
                image: form.coverArtBase64,
                genre_id: form.genre ? form.genre.id : null,
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
                licenses: this.$store.getters[
                    'trackAddWizard/selectedLicenses'
                ].map(({ id, price, status_id }) => {
                    return {
                        license_id: id,
                        price,
                        status_id,
                    }
                }),
                marketing: this.$store.getters[
                    'trackAddWizard/selectedFreeDls'
                ].map(({ id }) => {
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

            // Files
            const { stems, tagged, untaggedMp3, untaggedWav } = form.files

            if (stems) {
                params.track_stems = stems.base64
                params.track_stems_name = stems.name
            }

            if (tagged) {
                params.tagged_file = tagged.base64
                params.tagged_file_name = tagged.name
            }

            if (untaggedMp3) {
                params.untagged_mp3 = untaggedMp3.base64
                params.untagged_mp3_name = untaggedMp3.name
            }

            if (untaggedWav) {
                params.untagged_wav = untaggedWav.base64
                params.untagged_wav_name = untaggedWav.name
            }

            params.licenses = JSON.stringify(params.licenses)
            params.collaborators = JSON.stringify(params.collaborators)
            params.marketing = JSON.stringify(params.marketing)

            const {
                status,
                message,
                error,
            } = await this.$store.dispatch('me/createBeat', { params })

            if (status === 'success') {
                this.$toast.success(message)
                this.$router.push({ name: 'accountBeats' })
                this.$store.dispatch('trackAddWizard/reset')
            } else {
                this.$toast.error(error)
                this.saving = false
            }
        },
    },
}
</script>
