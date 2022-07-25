<template>
    <div class="InfoBlock">
        <div class="fieldset">
            <b-form-group :label="isSong ? 'Song Title*' : 'Beat Title*'">
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
                        You already have a beat with this title, pick a new one.
                    </template>
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Primary Genre">
                <BasicSelect
                    v-model="form.genre"
                    placeholder="Select Genre"
                    :options="genres"
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
                <b-form-invalid-feedback :state="!$v.form.tags.$error">
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
                            v-model="form.key"
                            placeholder="Select"
                            :options="audioKeys"
                            label="name"
                        />
                    </b-form-group>
                </b-col>
            </b-form-row>

            <b-form-group 
                label="Add to Beat Pack"
            >
                <beat-packs-multi-select
                    placeholder="Search for beat packs"
                    v-model="form.trackPack"
                />    
            </b-form-group>

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
                                {{ collab.user.name | truncate(14) }}
                                {{ collab.user.id == user.id ? '(you)' : '' }}
                            </div>
                        </div>
                        <div class="collab-col profit-col">
                            <label>Profit %</label>
                            <input
                                type="text"
                                class="form-control"
                                :readonly="index == 0"
                                :value="collab.profit"
                                @keyup="handleCollabProfitInput(collab, $event)"
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
                                    handleCollabPublishingInput(collab, $event)
                                "
                            />
                        </div>
                        <div class="collab-col remove-col" v-if="index > 0">
                            <IconButton
                                icon="close"
                                class="remove-icon"
                                @click="handleCollabRemoveClick(index)"
                            />
                            <basic-button
                                variant="link"
                                class="remove-btn"
                                @click="handleCollabRemoveClick(index)"
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
        </div>
    </div>
</template>

<script>
import BeatPacksMultiSelect from '~/components/Account/Tracks/Beats/BeatPacksMultiSelect'
import { collabsProfitFormMixin } from '~/mixins/tracks/collabsProfitForm'
import { required, minLength } from 'vuelidate/lib/validators'
import { api } from '~/services'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'

export default {
    name: 'InfoBlock',
    mixins: [collabsProfitFormMixin],
    components:{
        BeatPacksMultiSelect
    },
    data() {
        const {
            trackType,
            title,
            genre,
            tags,
            bpm,
            key,
            trackPack,
            collabs,
        } = this.$store.state.trackAddWizard.form
        return {
            tag: '',
            form: {
                trackType,
                title,
                genre: { ...genre },
                tags: [...tags],
                bpm,
                key: { ...key },
                trackPack,
                collabs: cloneDeep(collabs),
            },
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
            genres: 'common/genres',
            audioKeys: 'common/audioKeys',
            isSong: 'trackAddWizard/isSong',
        }),
    },
    validations: {
        form: {
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
                        userId: this.user.id,
                        value,
                    })
                    return status === 'success'
                },
            },
        },
    },
    created() {
        this.$bus.$on('wz.nextClick', this.validate)
        this.$bus.$on('wz.prevClick', this.updateWizardForm)
        this.$bus.$on('wz.editModal.saveClick', this.validate)
        this.$bus.$on('modal.userSearch.userSelected', this.handleCollabAdd)
        this.$bus.$on('modal.userInvite.userInvited', this.handleCollabAdd)
    },
    destroyed() {
        this.$bus.$off('modal.userSearch.userSelected')
    },
    methods: {
        updateWizardForm() {
            this.$store.dispatch('trackAddWizard/updateForm', {
                ...this.form,
            })
        },
        showCollabSearchModal() {
            this.$bus.$emit('modal.userSearch.open')
        },
        validate({ onSuccess }) {
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

            this.updateWizardForm()
            onSuccess()
        },
        handleTagsChange(tags) {
            this.form.tags = tags
        },
        
    },
}
</script>
