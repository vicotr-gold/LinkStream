<template>
    <div class="page page-sk">
        <header class="page-header">
            <div class="left-col">
                <h1 class="page-title">Your Beat Packs</h1>
                <div class="page-preview">
                    <span class="text-light">link.stream/</span>
                    <span>{{ user.user_name }}/beat-packs</span>
                    <basic-button
                        variant="outline-light"
                        size="xs"
                        :to="{
                            name: 'userBeatPacks',
                            params: { username: user.user_name },
                        }"
                    >
                        Preview
                    </basic-button>
                </div>
            </div>
            <div class="right-col">
                <basic-button :to="{ name: 'accountBeatPackAdd' }">
                    Add a Pack
                </basic-button>
            </div>
        </header>
        <main class="page-body">
            <LoadingSpinner class="page-loader" v-if="loading" />
            <div class="page-empty" v-if="!loading && !packs.length">
                <div class="empty-text">
                    Your Beat Packs will appear here.
                </div>
                <basic-button
                    class="empty-link"
                    variant="link"
                    :to="{
                        name: 'accountBeatPackAdd',
                    }"
                >
                    Add a Beat Pack
                </basic-button>
            </div>
            <Container
                v-else
                drag-handle-selector=".card-drag-icon"
                @drop="handleReorder"
            >
                <Draggable v-for="pack in sortableList" :key="pack.id">
                    <BeatPackCard :pack="pack" />
                </Draggable>
            </Container>
        </main>
    </div>
</template>

<script>
import BeatPackCard from '~/components/Account/Tracks/BeatPacks/BeatPackCard'
import { Container, Draggable } from 'vue-smooth-dnd'
import { mapGetters } from 'vuex'

export default {
    name: 'BeatPacks',
    components: {
        BeatPackCard,
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
            packs: 'me/beatPacks',
        }),
    },
    watch: {
        packs: {
            immediate: true,
            handler(newValue) {
                this.sortableList = [...newValue]
            },
        },
    },
    async created() {
        this.loading = true
        await this.$store.dispatch('me/loadBeatPacks')
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
            this.$store.dispatch('me/reorderBeatPack', {
                oldIndex,
                newIndex,
                sorts,
            })
        },
    },
}
</script>
