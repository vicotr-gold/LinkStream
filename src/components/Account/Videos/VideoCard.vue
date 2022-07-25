<template>
    <div class="Card VideoCard" :class="{ 'is-private': video.isPrivate }">
        <Icon class="card-drag-icon" icon="drag" />
        <main class="video-content" @click="handleEditClick">
            <div class="card-media">
                <span class="card-lock"></span>
                <img class="card-img" :src="thumbUrl" :alt="video.title" />
            </div>
            <div class="card-body">
                <h4 class="card-title">{{ video.title }}</h4>
                <small class="card-viz-badge">
                    Private
                </small>
            </div>
        </main>
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
    </div>
</template>

<script>
import { getYtVideoThumbUrl } from '~/utils'

export default {
    name: 'VideoCard',
    props: {
        video: {
            type: Object,
            required: true,
        },
    },
    computed: {
        thumbUrl() {
            return getYtVideoThumbUrl(
                this.$youtube.getIdFromUrl(this.video.url)
            )
        },
    },
    methods: {
        handleEditClick() {
            this.$emit('edit-click', this.video)
        },
        handleDeleteClick() {
            this.$emit('delete-click', this.video)
        },
    },
}
</script>
