<template>
    <b-modal
        modal-class="VideoEditModal"
        size="md"
        v-model="open"
        centered
        no-close-on-backdrop
        no-close-on-esc
    >
        <template v-slot:modal-header>
            <BasicButton variant="icon" class="modal-close" @click="close" />
            <h2 class="modal-title">Edit video info</h2>
        </template>

        <template v-slot:default>
            <youtube class="video-wrapper" :video-id="ytVidId"></youtube>
            <b-form-group label="YouTube Video URL" label-for="urlInput">
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

            <b-form-group label="Video Title" label-for="titleInput">
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
                        {{ $v.form.title.$params.minLength.min }} characters
                    </template>
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Primary Genre" label-for="genreInput">
                <BasicSelect
                    v-model="form.genre"
                    id="genreInput"
                    placeholder="Select Genre"
                    :options="genres"
                    :reduce="genre => genre.id"
                    label="genre"
                />
            </b-form-group>

            <b-form-group label="Related Track" label-for="trackInput">
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

            <template v-if="form.scheduled">
                <b-form-group label="Publish Date">
                    <b-input-group class="date-input-group">
                        <DatePicker v-model="form.date" />
                        <TimePicker v-model="form.time" />
                    </b-input-group>
                </b-form-group>
            </template>

            <basic-button variant="link" @click="handleScheduleToggle">
                {{
                    form.scheduled ? 'Clear scheduling ' : 'Schedule this video'
                }}
            </basic-button>
        </template>

        <template v-slot:modal-footer>
            <div class="left-col">
                <IconButton
                    icon="trash-sm"
                    title="Delete"
                    @click="handleDeleteClick"
                />
            </div>
            <div class="right-col">
                <basic-button
                    class="action-btn cancel-btn"
                    variant="secondary"
                    :disabled="saving"
                    @click="close"
                >
                    Cancel
                </basic-button>
                <spinner-button
                    class="action-btn"
                    :loading="saving"
                    @click="handleSaveClick"
                >
                    Save
                </spinner-button>
            </div>
        </template>
    </b-modal>
</template>

<script>
import { videoAddEditForm } from '~/mixins/videos/videoAddEditForm'

export default {
    name: 'VideoEditModal',
    mixins: [videoAddEditForm],
    data() {
        return {
            open: false,
            video: {},
        }
    },
    created() {
        this.$bus.$on('modal.videoEdit.open', this.handleOpen)
        this.$bus.$on('modal.videoEdit.close', this.handleClose)
    },
    methods: {
        close() {
            this.open = false
        },
        handleScheduleToggle() {
            this.form.scheduled = !this.form.scheduled
        },
        handleDeleteClick() {
            this.$emit('delete-click', this.video)
        },
        handleClose() {
            this.open = false
        },
        handleOpen(video) {
            this.video = { ...video }

            const {
                url,
                title,
                genre_id,
                related_track,
                public: visibility,
                scheduled,
                date,
                time,
            } = this.video

            this.form = {
                url,
                title,
                visibility,
                scheduled,
                genre: genre_id != '0' ? genre_id : null,
                relatedTrack: related_track != '0' ? related_track : null,
                date: scheduled ? new Date(date + ' 00:00:00') : new Date(),
                time: scheduled ? time : '00:00:00',
            }

            this.open = true
        },
    },
}
</script>
