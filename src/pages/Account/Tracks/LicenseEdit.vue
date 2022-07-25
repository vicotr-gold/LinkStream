<template>
    <div class="page page-license-edit">
        <nav class="page-nav">
            <basic-button
                class="back-btn"
                variant="text"
                :to="{ name: 'accountTracksLicenses' }"
            >
                <i class="ico ico-back"></i>
                <span>Licenses</span>
            </basic-button>
        </nav>
        <LoadingSpinner class="page-loader" v-if="loading" />
        <div v-else>
            <header class="page-header">
                <div class="left-col">
                    <h1 class="page-title">
                        {{ license.title }}
                    </h1>
                    <h4 class="page-subtitle">
                        Edit contract terms to apply to new track uploads
                    </h4>
                </div>
                <div class="right-col">
                    <div class="viz-toggle">
                        <span class="toggle-label">Enabled</span>
                        <TogglerButton v-model="form.enabled" />
                    </div>
                </div>
            </header>
            <main class="page-body">
                <div class="form-row no-wrap">
                    <div class="form-col">
                        <label>Default Price</label>
                    </div>
                    <div class="form-col">
                        <div class="money-input">
                            <Icon class="input-icon" icon="dollar" />
                            <input
                                type="text"
                                v-model="form.price"
                                class="form-control"
                                :class="{ 'is-invalid': $v.form.price.$error }"
                                v-cleave="{
                                    numeral: true,
                                }"
                            />
                        </div>
                        <b-form-invalid-feedback
                            :force-show="$v.form.price.$error"
                        >
                            Price can't be blank
                        </b-form-invalid-feedback>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>MP3 File</label>
                        <small class="form-text">
                            An untagged MP3 will be Included
                        </small>
                    </div>
                    <div class="form-col">
                        <div class="default-text">
                            Always included with license
                        </div>
                    </div>
                </div>
                <div class="form-row no-wrap">
                    <div class="form-col">
                        <label>WAV File</label>
                        <small class="form-text">
                            Include a WAV file?
                        </small>
                    </div>
                    <div class="form-col">
                        <TogglerButtonGroup v-model="form.wav" />
                    </div>
                </div>
                <div class="form-row no-wrap">
                    <div class="form-col">
                        <label>Trackout stems</label>
                        <small class="form-text">
                            Include trackout stems?
                        </small>
                    </div>
                    <div class="form-col">
                        <TogglerButtonGroup v-model="form.stems" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Number of distribution copies</label>
                    </div>
                    <div class="form-col">
                        <UnlimitedInputGroup
                            v-model="form.distributionCopies"
                        />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Number of free downloads</label>
                    </div>
                    <div class="form-col">
                        <UnlimitedInputGroup v-model="form.freeDownloads" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Number of audio streams</label>
                    </div>
                    <div class="form-col">
                        <UnlimitedInputGroup v-model="form.audioStreams" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Number of music videos</label>
                    </div>
                    <div class="form-col">
                        <UnlimitedInputGroup v-model="form.musicVideos" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Number of video streams</label>
                    </div>
                    <div class="form-col">
                        <UnlimitedInputGroup v-model="form.videoStreams" />
                    </div>
                </div>
                <div class="form-row no-wrap">
                    <div class="form-col">
                        <label>Broadcasting Rights</label>
                        <small class="form-text">
                            Can this license be used for broadcasting?
                        </small>
                    </div>
                    <div class="form-col">
                        <TogglerButtonGroup v-model="form.broadcastingRights" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Number of radio stations</label>
                    </div>
                    <div class="form-col">
                        <UnlimitedInputGroup v-model="form.radioStation" />
                    </div>
                </div>
                <div class="form-row no-wrap">
                    <div class="form-col">
                        <label>Paid Performances </label>
                        <small class="form-text">
                            Allow for paid performances?
                        </small>
                    </div>
                    <div class="form-col">
                        <TogglerButtonGroup v-model="form.paidPerformances" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Non-profit Performances</label>
                    </div>
                    <div class="form-col">
                        <UnlimitedInputGroup
                            v-model="form.nonProfitPerformances"
                        />
                    </div>
                </div>
            </main>
            <footer class="page-footer">
                <spinner-button :loading="saving" @click="handleSaveClick"
                    >Save</spinner-button
                >
            </footer>
        </div>
    </div>
</template>

<script>
import { UnlimitedInputGroup } from '~/components/Form'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'LicenseEdit',
    components: {
        UnlimitedInputGroup,
    },
    data() {
        return {
            loading: false,
            saving: false,
            license: null,
            form: {},
        }
    },
    validations: {
        form: {
            price: {
                required,
            },
        },
    },
    async created() {
        this.loading = true

        const licenseId = this.$route.params.id
        let license = this.$store.getters['me/findLicenseById'](licenseId)

        if (!license) {
            await this.$store.dispatch('me/loadLicenses')
            license = this.$store.getters['me/findLicenseById'](licenseId)
            if (!license) {
                this.$router.push({ name: 'accountTracksLicenses' })
                this.$toast.error('License not found.')
                return
            }
        }

        const form = {
            enabled: '1' === license.status_id,
            price: license.price,
            wav: '1' === license.wav,
            stems: '1' === license.trackout_stems,
            distributionCopies: license.distribution_copies,
            freeDownloads: license.free_download,
            audioStreams: license.audio_streams,
            musicVideos: license.music_videos,
            videoStreams: license.video_streams,
            broadcastingRights: '1' === license.broadcasting_rights,
            radioStation: license.radio_station,
            paidPerformances: '1' === license.paid_performances,
            nonProfitPerformances: license.non_profit_performances,
        }

        this.form = form
        this.license = license
        this.loading = false
    },
    methods: {
        async handleSaveClick() {
            this.$v.form.$touch()
            if (this.$v.form.$invalid) {
                this.$toast.error(" Price can't be blank.")
                return
            }

            this.saving = true

            const form = this.form

            const params = {
                status_id: form.enabled ? 1 : 0,
                price: form.price,
                wav: form.wav ? 1 : 0,
                trackout_stems: form.stems ? 1 : 0,
                distribution_copies: form.distributionCopies,
                free_download: form.freeDownloads,
                audio_streams: form.audioStreams,
                music_videos: form.musicVideos,
                video_streams: form.videoStreams,
                broadcasting_rights: form.broadcastingRights ? 1 : 0,
                radio_station: form.radioStation,
                paid_performances: form.paidPerformances ? 1 : 0,
                non_profit_performances: form.nonProfitPerformances,
            }

            const { status, error, message } = await this.$store.dispatch(
                'me/updateLicense',
                {
                    id: this.license.id,
                    params,
                }
            )

            if (status === 'success') {
                this.$toast.success(message)
                this.$router.push({ name: 'accountTracksLicenses' })
            } else {
                this.$toast.error(error)
                this.saving = false
            }
        },
    },
}
</script>
