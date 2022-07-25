<template>
    <div class="page page-vids">
        <header class="page-header">
            <div class="left-col">
                <h1 class="page-title">Your videos</h1>
                <h4 class="page-subtitle">
                    Add, remove, edit &amp; order videos anyway you'd like.
                </h4>
                <div class="page-preview">
                    <span class="text-light">link.stream/</span>
                    <span>{{ user.user_name }}/videos</span>
                    <basic-button
                        variant="outline-light"
                        size="xs"
                        :to="{
                            name: 'userVideos',
                            params: { username: user.user_name },
                        }"
                    >
                        Preview
                    </basic-button>
                </div>
            </div>
            <div class="right-col">
                <basic-button :to="{ name: 'accountVideoAdd' }">
                    Add New Video
                </basic-button>
            </div>
        </header>
        <main class="page-body">
            <div class="page-empty" v-if="!loading && !sortableList.length">
                <div class="empty-text">
                    Your Videos will appear here.
                </div>
                <basic-button
                    class="empty-link"
                    variant="link"
                    :to="{
                        name: 'accountVideoAdd',
                    }"
                >
                    Add a Video
                </basic-button>
            </div>
            <LoadingSpinner class="page-loader" v-if="loading" />
            <Container
                v-else
                drag-handle-selector=".card-drag-icon"
                @drop="handleReorder"
            >
                <Draggable v-for="video in sortableList" :key="video.id">
                    <VideoCard
                        :video="video"
                        @edit-click="handleEditClick"
                        @delete-click="handleDeleteClick"
                    />
                </Draggable>
            </Container>
        </main>
        <VideoEditModal @delete-click="handleDeleteClick" />
    </div>
</template>

<script>
import VideoEditModal from '~/components/Modal/VideoEditModal'
import VideoCard from '~/components/Account/Videos/VideoCard'
import { appConstants } from '~/constants'
import { Container, Draggable } from 'vue-smooth-dnd'
import { mapGetters } from 'vuex'

export default {
    name: 'Videos',
    components: {
        Container,
        Draggable,
        VideoEditModal,
        VideoCard,
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
            videos: 'me/videos',
        }),
    },
    watch: {
        videos: {
            immediate: true,
            handler(newValue) {
                this.sortableList = [...newValue]
            },
        },
    },
    async created() {
        this.loading = true
        await this.$store.dispatch('me/loadVideos', {
            params: {
                page: 1,
                page_size: appConstants.user.account.videosPerPage,
            },
        })
        this.loading = false
    },
    methods: {
        handleEditClick(video) {
            this.$bus.$emit('modal.videoEdit.open', video)
        },
        handleDeleteClick(video) {
            this.$alert.confirm({
                title: 'Delete video?',
                message: 'This video and its data will be permanently deleted.',
                onOk: async () => {
                    const {
                        status,
                        message,
                        error,
                    } = await this.$store.dispatch('me/deleteVideo', video)
                    if (status === 'success') {
                        this.$toast.success(message)
                        this.$bus.$emit('modal.videoEdit.close')
                    } else {
                        this.$toast.error(error)
                    }
                },
            })
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
            this.$store.dispatch('me/reorderVideo', {
                oldIndex,
                newIndex,
                sorts,
            })
        },
    },
}
</script>
