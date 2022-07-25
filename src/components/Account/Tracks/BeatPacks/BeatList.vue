<template>
    <div class="BeatList">
        <Container
            v-if="beats.length"
            drag-handle-selector=".BeatListItem .ico-drag"
            @drop="handleReorder"
        >
            <Draggable v-for="(beat, index) in beats" :key="beat.id">
                <BeatListItem
                    :beat="beat"
                    :index="index"
                    @remove-click="handleRemoveClick"
                />
            </Draggable>
        </Container>
        <div class="empty-message" v-else>
            <Icon icon="music-note" />
            <p>There are no Beats in this Pack</p>
        </div>
    </div>
</template>

<script>
import BeatListItem from './BeatListItem'
import { Container, Draggable } from 'vue-smooth-dnd'

export default {
    name: 'BeatList',
    components: {
        BeatListItem,
        Container,
        Draggable,
    },
    props: {
        beats: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        handleRemoveClick(index) {
            this.$emit('remove-item', index)
        },
        handleReorder(dropResult) {
            const { removedIndex: oldIndex, addedIndex: newIndex } = dropResult
            const beats = [...this.beats]
            const beat = beats[oldIndex]
            beats.splice(oldIndex, 1)
            beats.splice(newIndex, 0, beat)
            this.$emit('reorder-items', beats)
        },
    },
}
</script>