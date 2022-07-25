<template>
    <div class="Card BeatCard" :class="{ 'is-private': pack.isPrivate }">
        <LoadingMask v-if="processing" />
        <Icon class="card-drag-icon" icon="drag" />
        <div class="card-media">
            <span class="card-lock"></span>
            <img class="card-img" :src="pack.coverart" :alt="pack.title" />
        </div>
        <div class="card-body">
            <h4 class="card-title">
                {{ pack.title }}
                <span class="card-viz-badge badge badge-pill">
                    Private
                </span>
            </h4>
            <small class="card-subtitle">{{ beatCount }} beats</small>
        </div>
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
    name: 'BeatPackCard',
    props: {
        pack: {
            type: Object,
        },
    },
    data() {
        return {
            processing: false,
        }
    },
    computed: {
        beatCount() {
            return Array.isArray(this.pack.beats) ? this.pack.beats.length : 0
        },
    },
    methods: {
        handleEditClick() {
            this.$router.push({
                name: 'accountBeatPackEdit',
                params: { id: this.pack.id },
            })
        },
        handleDeleteClick() {
            this.$alert.confirm({
                title: 'Delete pack?',
                message: 'This pack and its data will be permanently deleted.',
                onOk: async () => {
                    this.processing = true
                    const {
                        status,
                        message,
                        error,
                    } = await this.$store.dispatch(
                        'me/deleteBeatPack',
                        this.pack
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