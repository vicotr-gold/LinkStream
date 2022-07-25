<template>
    <div class="page page-vid-add">
        <div class="fwz" :class="`is-step-${step}`">
            <h6 class="fwz-counter">Step {{ step }} / 2</h6>

            <section class="fwz-step" v-show="step === 1">
                <header class="step-header">
                    <h2 class="step-title">
                        Add a video
                    </h2>
                </header>
                <main class="step-body">
                    <div class="fieldset">
                        <b-form-group
                            label="YouTube Video URL"
                            label-for="urlInput"
                        >
                            <b-form-input
                                v-model="$v.form.url.$model"
                                id="urlInput"
                                placeholder="https://youtu.be/vwm_N2PCUz8"
                                :state="!$v.form.url.$error"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                                <template v-if="!$v.form.url.required">
                                    Enter the YouTube URL
                                </template>
                                <template v-else-if="!$v.form.url.valid">
                                    That's not a valid YouTube URL
                                </template>
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </div>
                </main>
            </section>

            <section class="fwz-step" v-show="step === 2">
                <header class="step-header">
                    <h2 class="step-title">
                        Review video info
                    </h2>
                    <h4 class="step-subtitle">
                        Preview and publish your content
                    </h4>
                </header>
                <main class="step-body">
                    <div class="fieldset">
                        <youtube
                            class="video-wrapper"
                            :video-id="ytVidId"
                        ></youtube>
                        <b-form-group
                            label="Video Title"
                            label-for="titleInput"
                        >
                            <b-form-input
                                id="titleInput"
                                placeholder="e.g. My Video"
                                v-model="$v.form.title.$model"
                                :state="!$v.form.title.$error"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                                <template v-if="!$v.form.title.required">
                                    Enter the title
                                </template>
                                <template v-else-if="!$v.form.title.minLength">
                                    Title should be at least
                                    {{ $v.form.title.$params.minLength.min }}
                                    characters
                                </template>
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group label="Genre" label-for="genreInput">
                            <BasicSelect
                                v-model="form.genre"
                                id="genreInput"
                                placeholder="Select Genre"
                                :options="genres"
                                :reduce="genre => genre.id"
                                label="genre"
                            />
                        </b-form-group>

                        <b-form-group
                            label="Related Track"
                            label-for="trackInput"
                        >
                            <BasicSelect
                                v-model="form.relatedTrack"
                                id="trackInput"
                                placeholder="Select Related Track"
                                :options="relatedTracks"
                                :reduce="track => track.id"
                                label="title"
                            />
                        </b-form-group>

                        <b-form-group label="Visibility">
                            <b-form-radio-group v-model="form.visibility">
                                <b-form-radio value="1">
                                    Public
                                </b-form-radio>
                                <b-form-radio value="2">
                                    Private
                                </b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                    </div>
                </main>
            </section>

            <footer class="fwz-pager">
                <basic-button
                    class="fwz-prev-btn"
                    variant="secondary"
                    :disabled="saving"
                    @click="goToStep(1)"
                >
                    Back
                </basic-button>
                <spinner-button
                    class="fwz-next-btn"
                    :loading="saving"
                    @click="handleNextClick"
                >
                    {{ step === 1 ? 'Next' : 'Add Video' }}
                </spinner-button>
            </footer>
        </div>
    </div>
</template>

<script>
import { videoAddEditForm } from '~/mixins/videos/videoAddEditForm'

export default {
    name: 'VideoAdd',
    mixins: [videoAddEditForm],
    data() {
        return {
            step: 1,
        }
    },
    methods: {
        goToStep(step) {
            if (this.step === 1) {
                this.$v.form.url.$touch()
                if (this.$v.form.url.$invalid) {
                    return
                }
            }
            this.step = step
        },
        handleNextClick() {
            if (this.step === 1) {
                this.goToStep(2)
            } else {
                this.save()
            }
        },
    },
}
</script>
