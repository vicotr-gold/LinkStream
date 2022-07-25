<template>
    <div class="ReviewBlock">
        <div class="Card">
            <h4 class="card-title">Track Info</h4>
            <BasicButton
                variant="icon"
                title="Edit"
                class="card-edit-btn"
                @click="handleEditClick('info')"
            />
            <p>Title: {{ title }}</p>
            <p>Type: {{ isSong ? 'Song' : 'Beat' }}</p>
            <p>Genre: {{ genre }}</p>
            <p>Tags: {{ tags }}</p>
            <p>BPM: {{ bpm }}</p>
            <p>Key: {{ key }}</p>
            <p>Collaborators: {{ collabs }}</p>
        </div>

        <div class="Card">
            <h4 class="card-title">Licensing</h4>
            <BasicButton
                variant="icon"
                title="Edit"
                class="card-edit-btn"
                @click="handleEditClick('licenses')"
            />
            <ul v-for="license in selectedLicenses" :key="license.id">
                <li>
                    ${{ license.price | trimZeroDecimal }} -
                    {{ license.title }}
                    <br />
                    {{ license.descripcion }}
                </li>
            </ul>
        </div>

        <div class="Card">
            <h4 class="card-title">Files</h4>
            <BasicButton
                variant="icon"
                title="Edit"
                class="card-edit-btn"
                @click="handleEditClick('files')"
            />
            <p>
                <span class="text-danger" v-if="$v.files.untaggedMp3.$invalid">
                    Untagged MP3: Required
                </span>
                <template v-else-if="files.untaggedMp3">
                    Untagged MP3: {{ files.untaggedMp3.name }}
                </template>
            </p>
            <p>
                <span class="text-danger" v-if="$v.files.untaggedWav.$invalid">
                    Untagged WAV: Required
                </span>
                <template v-else-if="files.untaggedWav">
                    Untagged WAV: {{ files.untaggedWav.name }}
                </template>
            </p>
            <p v-if="files.tagged">Tagged File: {{ files.tagged.name }}</p>
            <p>
                <span class="text-danger" v-if="$v.files.stems.$invalid">
                    Track Stems: Required
                </span>
                <template v-else-if="files.stems">
                    Track Stems: {{ files.stems.name }}
                </template>
            </p>
        </div>

        <div class="Card">
            <h4 class="card-title">Marketing</h4>
            <BasicButton
                variant="icon"
                title="Edit"
                class="card-edit-btn"
                @click="handleEditClick('marketing')"
            />
            <p v-if="!selectedFreeDls.length">
                No free downloads
            </p>
            <ul>
                <li v-for="m in selectedFreeDls" :key="m.id">
                    {{ m.title }}
                </li>
            </ul>
        </div>

        <div class="Card viz-card">
            <header class="card-header">
                <h4 class="card-title">Visibility</h4>
                <div class="viz-toggle">
                    <span class="toggle-label">
                        {{ form.isPublic ? 'Public' : 'Private' }}
                    </span>
                    <TogglerButton v-model="form.isPublic" />
                </div>
            </header>
            <b-form-group label="Set Release Date" v-show="form.scheduled">
                <b-input-group class="date-input-group">
                    <DatePicker v-model="form.date" />
                    <TimePicker v-model="form.time" />
                </b-input-group>
            </b-form-group>
            <basic-button variant="link" @click="handleScheduleToggle">
                {{ form.scheduled ? 'Remove schedule' : 'Schedule release' }}
            </basic-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'ReviewBlock',
    data() {
        const { scheduled, isPublic } = this.$store.state.trackAddWizard.form
        return {
            form: {
                isPublic,
                scheduled,
                date: new Date(),
                time: '00:00:00',
            },
        }
    },
    computed: {
        ...mapGetters({
            isSong: 'trackAddWizard/isSong',
            validations: 'trackAddWizard/validations',
            selectedLicenses: 'trackAddWizard/selectedLicenses',
            selectedFreeDls: 'trackAddWizard/selectedFreeDls',
        }),
        summary() {
            return this.$store.state.trackAddWizard.form
        },
        title() {
            return this.summary.title
        },
        genre() {
            return this.summary.genre ? this.summary.genre.genre : ''
        },
        bpm() {
            return this.summary.bpm
        },
        key() {
            return this.summary.key ? this.summary.key.name : ''
        },
        files() {
            return this.summary.files
        },
        collabs() {
            return this.summary.collabs.map(({ user }) => user.name).join(', ')
        },
        tags() {
            return this.summary.tags.map(({ text }) => text).join(', ')
        },
    },
    validations() {
        return {
            files: this.validations.files,
        }
    },
    created() {
        this.$bus.$on('wz.saveClick', this.validate)
        this.$bus.$on('wz.prevClick', this.updateWizardForm)
    },
    methods: {
        updateWizardForm() {
            this.$store.dispatch('trackAddWizard/updateForm', {
                ...this.form,
            })
        },
        validate({ onSuccess }) {
            if (this.$v.files.$invalid) {
                this.$toast.error('Please review and add required files.')
                return
            }
            this.updateWizardForm()
            onSuccess()
        },
        handleScheduleToggle() {
            this.form.scheduled = !this.form.scheduled
        },
        handleEditClick(section) {
            this.$bus.$off('wz.editModal.saveClick')
            this.$bus.$emit(`wz.modal.${section}.open`)
        },
    },
}
</script>
