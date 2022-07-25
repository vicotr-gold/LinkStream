<template>
    <div class="Card BeatCard" :class="{ 'is-private': beat.isPrivate }">
        <LoadingMask v-if="processing" />
        <Icon class="card-drag-icon" icon="drag" />
        <div class="card-media">
            <span class="card-lock"></span>
            <img class="card-img" :src="beat.coverart" :alt="beat.title" />
        </div>
        <h4 class="card-title">
            {{ beat.title }}
            <span class="card-viz-badge badge badge-pill">
                Private
            </span>
        </h4>
        <div class="file-badges">
            <span
                class="badge badge-pill"
                :class="{ hidden: !badge.show }"
                v-for="(badge, index) in fileBadges"
                :key="index"
            >
                {{ badge.text }}
            </span>
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
    name: 'BeatCard',
    props: {
        beat: {
            type: Object,
        },
    },
    data() {
        return {
            processing: false,
        }
    },
    computed: {
        fileBadges() {
            const { untagged_mp3, untagged_wav, trackout_stems } = this.beat

            const badges = [
                { text: 'MP3', show: !!untagged_mp3 },
                { text: 'WAV', show: !!untagged_wav },
                { text: 'ZIP', show: !!trackout_stems },
            ]

            badges.sort(function(a, b) {
                return b.show - a.show
            })

            return badges
        },
    },
    methods: {
        handleEditClick() {
            this.$router.push({
                name: 'accountBeatEdit',
                params: { id: this.beat.id },
            })
        },
        handleDeleteClick() {
            this.$alert.confirm({
                title: 'Delete beat?',
                message: 'This beat and its data will be permanently deleted.',
                onOk: async () => {
                    this.processing = true
                    const {
                        status,
                        message,
                        error,
                    } = await this.$store.dispatch('me/deleteBeat', this.beat)
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