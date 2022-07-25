<template>
    <div class="Card LinkCard" :class="{ 'is-private': link.isPrivate }">
        <LoadingMask v-show="processing" />
        <section class="view-section" v-show="!isEditMode">
            <Icon class="card-drag-icon" icon="drag" />
            <div class="card-media" @click="handleEditClick">
                <img class="card-img" :src="link.coverart" :alt="link.title" />
            </div>
            <main class="card-body" @click="handleEditClick">
                <h4 class="card-title">{{ link.title }}</h4>
                <small class="card-viz-badge" v-if="link.isPrivate">
                    Hidden
                </small>
            </main>
            <BasicButton
                variant="icon"
                title="Delete"
                class="card-trash-btn"
                @click="handleDeleteClick"
            />
            <BasicButton
                variant="icon"
                title="Edit"
                class="card-edit-btn"
                @click="handleEditClick"
            />
        </section>
        <section class="edit-section" v-if="isEditMode">
            <IconButton
                icon="close"
                class="card-close-btn"
                title="Close"
                @click="closeEditMode"
            />
            <main class="card-body">
                <DropImage
                    :src="form.coverArtBase64"
                    msg-long="Drag image here&nbsp;or&nbsp;<u>browse</u>"
                    msg-short=""
                    @add-file="handleImageAdd"
                    @remove-file="handleImageRemove"
                />
                <form class="edit-form">
                    <b-form-group>
                        <b-form-input
                            placeholder="e.g. https://myblog.blogspot.com"
                            v-model="$v.form.url.$model"
                            :state="!$v.form.url.$error"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                            <template v-if="!$v.form.url.required">
                                Enter the URL
                            </template>
                            <template v-else>
                                That's not a valid URL
                            </template>
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                        <b-form-input
                            placeholder="e.g. My Blog"
                            v-model="$v.form.title.$model"
                            :state="!$v.form.title.$error"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                            Enter a title
                        </b-form-invalid-feedback>
                    </b-form-group>
                </form>
            </main>
            <footer class="card-edit-actions">
                <div class="left-col">
                    <IconButton
                        icon="trash-sm"
                        title="Delete"
                        @click="handleDeleteClick"
                    />
                </div>
                <div class="right-col">
                    <icon-button
                        :title="link.isPublic ? 'Hide' : 'Unhide'"
                        @click="handleVisibilityToggleClick"
                    >
                        <Icon
                            :icon="
                                link.isPublic
                                    ? 'eye-cir-gray'
                                    : 'eye-slash-cir-gray'
                            "
                        />
                    </icon-button>
                    <IconButton
                        icon="clock-cir-gray"
                        title="Schedule"
                        @click="handleChangeScheduleClick"
                    />
                    <basic-button
                        variant="tertiary"
                        size="sm"
                        @click="handleSaveClick"
                    >
                        Save
                    </basic-button>
                </div>
            </footer>
            <div class="pubdate" v-if="link.scheduled">
                Scheduled: {{ link.date | mmddyyyy }}
                <b-dropdown variant="link" text="Modify" no-caret>
                    <b-dropdown-item @click="handleChangeScheduleClick">
                        Change Date
                    </b-dropdown-item>
                    <b-dropdown-item @click="handleRemoveScheduleClick">
                        Remove Scheduling
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </section>
    </div>
</template>

<script>
import { linkAddEditForm } from '~/mixins/links/linkAddEditForm'
import { appConstants } from '~/constants'

export default {
    name: 'VideoCard',
    mixins: [linkAddEditForm],
    props: {
        link: {
            type: Object,
            required: true,
        },
    },
    methods: {
        async toggleVisibility() {
            this.processing = true
            const { status, error } = await this.$store.dispatch(
                'me/updateLink',
                {
                    id: this.link.id,
                    params: {
                        public: this.link.isPublic
                            ? appConstants.visibilities.private
                            : appConstants.visibilities.public,
                    },
                }
            )
            status !== 'success' && this.$toast.error(error)
            this.processing = false
        },
        closeEditMode() {
            this.isEditMode = false
        },
        handleEditClick() {
            this.isEditMode = true
        },
        handleChangeScheduleClick() {
            this.$emit('schedule-click', this.link)
        },
        handleDeleteClick() {
            this.$alert.confirm({
                title: 'Delete link?',
                message: 'This link and its data will be permanently deleted.',
                onOk: async () => {
                    this.processing = true
                    const {
                        status,
                        message,
                        error,
                    } = await this.$store.dispatch('me/deleteLink', this.link)
                    status === 'success'
                        ? this.$toast.success(message)
                        : this.$toast.error(error)
                    this.processing = false
                },
            })
        },
        async handleRemoveScheduleClick() {
            this.processing = true
            const { status, message, error } = await this.$store.dispatch(
                'me/updateLink',
                {
                    id: this.link.id,
                    params: {
                        scheduled: 0,
                        date: null,
                        time: null,
                        end_date: null,
                        end_time: null,
                    },
                }
            )
            status === 'success'
                ? this.$toast.success(message)
                : this.$toast.error(error)
            this.processing = false
        },
        handleVisibilityToggleClick() {
            if (this.link.isPrivate) {
                this.toggleVisibility()
            } else {
                this.$alert.confirm({
                    title: 'Hide link?',
                    message:
                        'This link will be hidden from your visitors. Are you sure?',
                    onOk: this.toggleVisibility,
                })
            }
        },
    },
}
</script>
