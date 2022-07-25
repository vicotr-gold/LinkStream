<template>
    <div class="page page-beats">
        <header class="page-header">
            <div class="left-col">
                <h1 class="page-title">Your beats</h1>
                <div class="page-preview">
                    <span class="text-light">link.stream/</span>
                    <span>{{ user.user_name }}/beats</span>
                    <basic-button
                        variant="outline-light"
                        size="xs"
                        :to="{
                            name: 'userBeats',
                            params: { username: user.user_name },
                        }"
                    >
                        Preview
                    </basic-button>
                </div>
            </div>
            <div class="right-col">
                <basic-button :to="{ name: 'accountBeatAdd' }">
                    Add a Beat
                </basic-button>
            </div>
        </header>
        <main class="page-body">
            <LoadingSpinner class="page-loader" v-if="loading" />
            <div class="page-empty" v-if="!loading && !sortableList.length">
                <div class="empty-text">
                    Your beats will appear here.
                </div>
                <basic-button
                    class="empty-link"
                    variant="link"
                    :to="{
                        name: 'accountBeatAdd',
                    }"
                >
                    Add a beat
                </basic-button>
            </div>
            <Container
                v-else
                drag-handle-selector=".card-drag-icon"
                @drop="handleReorder"
            >
                <Draggable v-for="beat in sortableList" :key="beat.id">
                    <BeatCard :beat="beat" />
                </Draggable>
            </Container>
        </main>
    </div>
</template>

<script>
import BeatCard from '~/components/Account/Tracks/Beats/BeatCard'
import { Container, Draggable } from 'vue-smooth-dnd'
import { mapGetters } from 'vuex'

export default {
    name: 'Beats',
    components: {
        BeatCard,
        Container,
        Draggable,
    },
    data() {
        return {
            loading: false,
            sortableList: [],
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
            beats: 'me/beats',
        }),
    },
    watch: {
        beats: {
            immediate: true,
            handler(newValue) {
                this.sortableList = [...newValue]
            },
        },
    },
    async created() {
        this.loading = true
        await this.$store.dispatch('me/loadBeats')
        this.loading = false
    },
    methods: {
        handleReorder(dropResult) {
            const { removedIndex: oldIndex, addedIndex: newIndex } = dropResult
            const list = [...this.sortableList]
            const item = list[oldIndex]
            list.splice(oldIndex, 1)
            list.splice(newIndex, 0, item)
            const sorts = list.map(({ id }, index) => {
                return {
                    id,
                    sort: (index + 1).toString(),
                }
            })
            this.$store.dispatch('me/reorderBeat', {
                oldIndex,
                newIndex,
                sorts,
            })
        },
    },
}
</script>
