<template>
    <div class="BeatListItem">
        <div class="item-cover">
            <span class="lock-overlay" v-if="beat.isPrivate"></span>
            <img :src="beat.coverart" :alt="beat.title" />
        </div>
        <div class="item-body">
            <h4 class="item-title">
                {{ beat.title }}
            </h4>
            <small class="item-subtitle">
                {{ genreLabelById(beat.genre_id) }}
            </small>
        </div>
        <IconButton icon="close" @click="handleRemoveClick(index)" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'BeatPackListItem',
    props: {
        beat: {
            type: Object,
        },
        index: {
            type: [String, Number],
        },
    },
    computed: {
        ...mapGetters({
            genreLabelById: 'common/genreLabelById',
        }),
    },
    methods: {
        handleRemoveClick(index) {
            this.$emit('remove-click', index)
        },
    },
}
</script>