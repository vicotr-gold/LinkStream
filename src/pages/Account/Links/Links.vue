<template>
    <div class="page page-links">
        <header class="page-header">
            <div class="left-col">
                <h1 class="page-title">Your links</h1>
                <h4 class="page-subtitle">
                    Add, remove, edit &amp; order links anyway you'd like.
                </h4>
                <div class="page-preview">
                    <span class="text-light">link.stream/</span>
                    <span>{{ user.user_name }}/links</span>
                    <basic-button
                        variant="outline-light"
                        size="xs"
                        :to="{
                            name: 'userLinks',
                            params: { username: user.user_name },
                        }"
                    >
                        Preview
                    </basic-button>
                </div>
            </div>
            <div class="right-col">
                <basic-button :to="{ name: 'accountLinkAdd' }">
                    Add New Link
                </basic-button>
            </div>
        </header>
        <main class="page-body">
            <div class="page-empty" v-if="!loading && !sortableList.length">
                <div class="empty-text">
                    Your Links will appear here.
                </div>
                <basic-button
                    class="empty-link"
                    variant="link"
                    :to="{
                        name: 'accountLinkAdd',
                    }"
                >
                    Add a Link
                </basic-button>
            </div>
            <LoadingSpinner class="page-loader" v-if="loading" />
            <Container
                v-else
                @drop="handleReorder"
                drag-handle-selector=".card-drag-icon"
            >
                <Draggable v-for="link in sortableList" :key="link.id">
                    <LinkCard
                        :link="link"
                        @schedule-click="handleScheduleClick"
                    />
                </Draggable>
            </Container>
        </main>
        <LinkScheduleModal />
    </div>
</template>

<script>
import LinkCard from '~/components/Account/Links/LinkCard'
import LinkScheduleModal from '~/components/Modal/LinkScheduleModal'
import { Container, Draggable } from 'vue-smooth-dnd'
import { mapGetters } from 'vuex'

export default {
    name: 'Links',
    components: {
        LinkCard,
        Container,
        Draggable,
        LinkScheduleModal,
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
            links: 'me/links',
        }),
    },
    watch: {
        links: {
            immediate: true,
            handler(newValue) {
                this.sortableList = [...newValue]
            },
        },
    },
    async created() {
        this.loading = true
        await this.$store.dispatch('me/loadLinks')
        this.loading = false
    },
    methods: {
        handleScheduleClick(link) {
            this.$bus.$emit('modal.linkSchedule.open', link)
        },
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
            this.$store.dispatch('me/reorderLink', {
                oldIndex,
                newIndex,
                sorts,
            })
        },
    },
}
</script>
