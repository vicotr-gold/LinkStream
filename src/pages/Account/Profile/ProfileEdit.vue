<template>
    <b-container class="page page-profile-edit p-sm-5">
        <b-form
            @submit.stop.prevent="onSubmit"
            @reset="resetForm"
            :novalidate="true"
        >
            <b-row>
                <b-col cols="12" class="d-none d-sm-block">
                    <h2 class="page-title">Edit your profile</h2>
                </b-col>
                <b-col cols="12" class="profile-images-container mt-sm-4">
                    <div
                        class="banner-container"
                        ref="banner-container"
                        v-resize="onResize"
                    >
                        <DokaOverlay
                            utils="crop,resize"
                            class="banner"
                            :crop="banner.crop"
                            :src="banner.src"
                            :enabled="banner.enabled"
                            :size="banner.size"
                            @confirm="handleDokaConfirmBanner"
                            @cancel="handleDokaCancelBanner"
                        >
                            <input
                                ref="banner"
                                v-if="!banner.enabled"
                                type="file"
                                accept="image/*"
                                @change="handleFileChangeBanner"
                            />
                            <img :src="banner.image" />
                        </DokaOverlay>
                        <b-button
                            v-if="!banner.enabled"
                            @click="$refs['banner'].click()"
                        >
                            <font-awesome-icon
                                :icon="['fas', 'camera']"
                                size="lg"
                            />
                        </b-button>
                    </div>
                    <div class="avatar-container">
                        <div class="avatar-box">
                            <input
                                ref="avatar"
                                v-if="!avatar.enabled"
                                type="file"
                                accept="image/*"
                                @change="handleFileChangeAvatar"
                            />
                            <img v-if="avatar.image" :src="avatar.image" />
                            <vue-letter-avatar
                                v-else
                                :name="user.display_name"
                                size="150"
                                :rounded="true"
                            />
                        </div>
                        <b-button
                            v-if="!avatar.enabled"
                            @click="$refs['avatar'].click()"
                        >
                            <font-awesome-icon
                                :icon="['fas', 'camera']"
                                size="lg"
                            />
                        </b-button>
                    </div>
                    <DokaModal
                        v-if="avatar.enabled"
                        utils="crop,filter,color,resize"
                        cropAspectRatio="1"
                        :src="avatar.src"
                        :outputData="true"
                        :cropMask="mask"
                        :size="avatar.size"
                        @confirm="handleDokaConfirmAvatar"
                        @cancel="handleDokaCancelAvatar"
                    />
                </b-col>
                <b-col cols="12" class="mt-4 profile_edit_elements">
                    <b-row>
                        <b-col cols="12">
                            <b-form-group class="mb-4 error-l-110">
                                <slot name="label">
                                    <label for="display_name">
                                        Display name
                                        <span class="text-danger">*</span>
                                    </label>
                                </slot>
                                <b-form-input
                                    id="display_name"
                                    name="display_name"
                                    type="text"
                                    v-model="form.display_name"
                                    v-validate="{ required: true, min: 8 }"
                                    :state="validateState('display_name')"
                                    aria-describedby="display-name-live-feedback"
                                    data-vv-as="display name"
                                ></b-form-input>
                                <b-form-invalid-feedback
                                    id="display-name-live-feedback"
                                >
                                    {{ veeErrors.first('display_name') }}
                                </b-form-invalid-feedback>
                            </b-form-group>
                        </b-col>
                        <b-col cols="12">
                            <b-form-group
                                label="Profile URL"
                                class="mb-4 error-l-100"
                            >
                                <label class="small text-muted">
                                    link.stream/
                                </label>
                                <template v-if="form.editableUrl">
                                    <b-form-input
                                        id="url"
                                        name="url"
                                        type="text"
                                        class="d-inline-block w-50 small px-2"
                                        v-model="form.url"
                                        v-validate="{
                                            required: true,
                                            min: 8,
                                            uniqueUrl: true,
                                        }"
                                        :state="validateState('url')"
                                        aria-describedby="url-live-feedback"
                                        data-vv-as="url"
                                    ></b-form-input>
                                    <b-button
                                        variant="transparent"
                                        class="btn btn-input-spinner"
                                        v-if="validating.url"
                                    >
                                        <b-spinner></b-spinner>
                                    </b-button>
                                    <b-form-invalid-feedback
                                        id="url-live-feedback"
                                    >
                                        {{ veeErrors.first('url') }}
                                    </b-form-invalid-feedback>
                                </template>
                                <template v-else>
                                    <label class="small">{{ form.url }}</label>
                                </template>
                                <basic-button
                                    variant="outline-light"
                                    size="xs"
                                    class="ml-3"
                                    @click="handleCustomizeUrl"
                                >
                                    <template v-if="form.editableUrl">
                                        Done
                                    </template>
                                    <template v-else>Customize</template>
                                </basic-button>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group
                                label="First name"
                                label-for="first_name"
                                class="mb-4"
                            >
                                <b-form-input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    v-model="form.first_name"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group
                                label="Last name"
                                label-for="last_name"
                                class="mb-4"
                            >
                                <b-form-input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    v-model="form.last_name"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group
                                label="City"
                                label-for="city"
                                class="mb-4"
                            >
                                <b-form-input
                                    id="city"
                                    name="city"
                                    type="text"
                                    v-model="form.city"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col sm="6">
                            <b-form-group
                                label="Country"
                                label-for="country"
                                class="mb-4"
                            >
                                <BasicSelect
                                    v-model="form.country"
                                    :options="allCountries"
                                    :reduce="country => country.code"
                                    label="country"
                                />
                            </b-form-group>
                        </b-col>
                        <b-col cols="12">
                            <b-form-group
                                label="Bio"
                                label-for="bio"
                                class="mb-4"
                            >
                                <b-form-textarea
                                    id="bio"
                                    name="bio"
                                    v-model="form.bio"
                                    placeholder="A short bio that will appear on your profile"
                                    rows="3"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col cols="12" class="mb-5">
                    <spinner-button
                        type="submit"
                        class="mt-5"
                        :loading="status.loading.update"
                        :error="status.error.update"
                    >
                        Save Updates
                    </spinner-button>
                </b-col>
            </b-row>
        </b-form>
    </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import resize from 'vue-resize-directive'
import { Validator } from 'vee-validate'
import { DokaModal, DokaOverlay, toURL } from 'vue-doka'
import { blobToBase64 } from 'base64-blob'
import csc from 'country-state-city'
import { setStatusChange } from '~/utils'
import { api } from '~/services'
import { appConstants } from '~/constants'

export default {
    name: 'ProfileEdit',
    directives: {
        resize,
    },
    components: {
        DokaModal,
        DokaOverlay,
    },
    data() {
        const user = this.$store.getters['me/user']

        return {
            mask: (root, setInnerHTML) => {
                // https://pqina.nl/doka/docs/patterns/api/doka-instance/#setting-the-crop-mask
                setInnerHTML(
                    root,
                    `
                    <mask id="my-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        <circle cx="50%" cy="50%" r="50%" fill="black"/>
                    </mask>
                    <rect fill="rgba(255,255,255,.3125)" x="0" y="0" width="100%" height="100%" mask="url(#my-mask)"/>
                    <circle cx="50%" cy="50%" r="50%" fill="transparent" stroke-width="1" stroke="#fff"/>
                `
                )
            },
            banner: {
                enabled: false,
                image: user.banner,
                srcPrev: null,
                src: null,
                crop: {
                    aspectRatio: appConstants.user.profileBannerAspectRatio,
                },
                size: {
                    width: 1024,
                    height: 260,
                },
            },
            avatar: {
                enabled: false,
                image: user.photo,
                srcPrev: null,
                src: null,
                crop: {
                    aspectRatio: 1,
                },
                size: {
                    width: 150,
                    height: 150,
                },
            },
            form: {
                banner: null,
                avatar: null,
                display_name: user.display_name,
                first_name: user.first_name,
                last_name: user.last_name,
                city: user.city,
                country: user.country,
                bio: user.bio,
                url: user.url,
                editableUrl: false,
            },
            status: {
                loading: {
                    update: false,
                },
                error: {
                    update: null,
                },
            },
            validating: {
                url: false,
            },
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
        }),
        allCountries() {
            return csc.getAllCountries().map(({ sortname, name }) => {
                return {
                    code: sortname,
                    country: name,
                }
            })
        },
    },
    mounted() {
        // URL availability validations
        Validator.extend('uniqueUrl', {
            validate: async value => {
                this.validating.url = true
                const { status, error } = await api.users.getAvailability({
                    type: 'url',
                    value,
                    userId: this.user.id,
                })
                if (status !== 'success') {
                    return { data: { message: error } }
                }
                this.validating.url = false
                return { valid: true }
            },
            getMessage: (field, params, data) => data.message,
        })
    },
    methods: {
        // Resize
        onResize() {
            this.$refs['banner-container'].style.height =
                appConstants.user.profileBannerAspectRatio *
                    this.$refs['banner-container'].clientWidth +
                'px'
        },
        // Banner
        handleFileChangeBanner(e) {
            if (!e.target.files.length) return
            this.banner = {
                ...this.banner,
                srcPrev: this.banner.src,
                src: e.target.files[0],
                enabled: true,
            }
        },
        async handleDokaConfirmBanner(output) {
            const base64 = await blobToBase64(output.file)
            if (base64) {
                this.banner = {
                    ...this.banner,
                    srcPrev: null,
                    image: toURL(output.file),
                    crop: output.data.crop,
                    enabled: false,
                }
                this.form = {
                    ...this.form,
                    banner: base64,
                }
            }
        },
        handleDokaCancelBanner() {
            this.banner = {
                ...this.banner,
                src: this.banner.srcPrev || this.banner.src,
                srcPrev: null,
                enabled: false,
            }
        },
        // Avatar
        handleFileChangeAvatar(e) {
            if (!e.target.files.length) return
            this.avatar = {
                ...this.avatar,
                srcPrev: this.avatar.src,
                src: e.target.files[0],
                enabled: true,
            }
        },
        async handleDokaConfirmAvatar(output) {
            const base64 = await blobToBase64(output.file)
            if (base64) {
                this.avatar = {
                    ...this.avatar,
                    srcPrev: null,
                    image: toURL(output.file),
                    crop: output.data.crop,
                    enabled: false,
                }
                this.form = {
                    ...this.form,
                    avatar: base64,
                }
            }
        },
        handleDokaCancelAvatar() {
            this.avatar = {
                ...this.avatar,
                src: this.avatar.srcPrev || this.avatar.src,
                srcPrev: null,
                enabled: false,
            }
        },
        // Form
        validateState(ref) {
            if (
                this.veeFields[ref] &&
                (this.veeFields[ref].dirty || this.veeFields[ref].validated)
            ) {
                return !this.veeErrors.has(ref)
            }
            return null
        },
        handleCustomizeUrl() {
            if (this.form.editableUrl) {
                this.$validator.validate('url').then(async result => {
                    if (!result) {
                        return
                    }
                    this.form.editableUrl = false
                })
            } else {
                this.form.editableUrl = true
            }
        },
        async onSubmit() {
            this.$validator.validateAll().then(async result => {
                if (!result) {
                    return
                }
                this.status.loading.update = true
                const {
                    banner,
                    avatar,
                    display_name,
                    first_name,
                    last_name,
                    url,
                    city,
                    country,
                    bio,
                } = this.form
                const params = {
                    display_name,
                    first_name,
                    last_name,
                    url,
                    city,
                    country,
                    bio,
                }
                if (banner) params.banner = banner
                if (avatar) params.image = avatar
                const { status, data, error } = await api.users.updateUser(
                    this.user.id,
                    params
                )
                if (status === 'success') {
                    setStatusChange(this, 'status.error.update', false, () => {
                        this.resetForm()
                    })
                    this.$store.dispatch('me/updateProfile', { user: data })
                    this.$toast.success(
                        'Your profile has been updated successfully.'
                    )
                } else {
                    setStatusChange(this, 'status.error.update')
                    this.$toast.error(error)
                }
                this.status.loading.update = false
            })
        },
        resetForm() {},
    },
}
</script>
