<template>
    <div class="BeatList">
        <BeatPackListItem
            v-for="(beat, index) in beatPacks"
            :key="beat.id"
            :beat="beat"
            :index="index"
            @remove-click="handleRemoveClick"
        />
        <div class="empty-message" v-if="!beatPacks.length">
            <Icon icon="music-note" />
            <p>There are no Beats in this Pack</p>
        </div>
    </div>
</template>

<script>
import BeatPackListItem from './BeatPackListItem'

export default {
    name: 'BeatPacList',
    components: {
        BeatPackListItem,
    },
    props: {
        beatPacks: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        handleRemoveClick(index) {
            this.$emit('remove-item', index)
        },
    },
}
</script>