<template>
    <div class="Card BeatCard" :class="{ 'is-private': kit.isPrivate }">
        <LoadingMask v-if="processing" />
        <Icon class="card-drag-icon" icon="drag" />
        <div class="card-media">
            <span class="card-lock"></span>
            <img class="card-img" :src="kit.coverart" :alt="kit.title" />
        </div>
        <h4 class="card-title">
            {{ kit.title }}
        </h4>
        <BasicButton
            variant="icon"
            class="card-trash-btn"
            title="Delete"
            @click="handleDeleteClick"
        />
        <BasicButton
            variant="icon"
            class="card-edit-btn"
            title="Edit"
            @click="handleEditClick"
        />
        <b-dropdown class="actions-menu" variant="icon" dropleft no-caret>
            <template v-slot:button-content>
                <Icon icon="dot-menu-v" />
            </template>
            <b-dropdown-item @click="handleEditClick">
                Edit
            </b-dropdown-item>
            <b-dropdown-item @click="handleDeleteClick">
                Delete
            </b-dropdown-item>
        </b-dropdown>
    </div>
</template>

<script>
export default {
    name: 'SoundKitCard',
    props: {
        kit: {
            type: Object,
        },
    },
    data() {
        return {
            processing: false,
        }
    },
    methods: {
        handleEditClick() {
            this.$router.push({
                name: 'accountSoundKitEdit',
                params: {
                    id: this.kit.id,
                },
            })
        },
        handleDeleteClick() {
            this.$alert.confirm({
                title: 'Delete kit?',
                message: 'This kit and its data will be permanently deleted.',
                onOk: async () => {
                    this.processing = true
                    const {
                        status,
                        message,
                        error,
                    } = await this.$store.dispatch(
                        'me/deleteSoundKit',
                        this.kit
                    )
                    status === 'success'
                        ? this.$toast.success(message)
                        : this.$toast.error(error)
                    this.processing = false
                },
            })
        },
    },
}
</script>