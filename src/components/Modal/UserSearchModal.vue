<template>
    <b-modal
        :modal-class="{
            UserSearchModal: true,
            'is-searching': isSearching,
            'show-results': isShowResults,
        }"
        size="md"
        centered
        hide-footer
        v-model="open"
    >
        <template v-slot:modal-header>
            <BasicButton variant="icon" class="modal-close" @click="close" />
            <h2 class="modal-title">Search for collaborator</h2>
        </template>

        <template v-slot:default>
            <SearchInput
                placeholder="Username or email"
                maxlength="35"
                v-model.trim="searchText"
            />
            <LoadingSpinner animation="bounce" />
            <ul class="search-results">
                <li
                    v-for="user in results"
                    :key="user.id"
                    @click="handleUserClick(user)"
                >
                    <UserAvatar :user="user" />
                    {{ user.name }}
                </li>
                <li class="invite">
                    <p>
                        Can't find who you're looking for?
                        <basic-button variant="link" @click="handleInviteClick">
                            Send an invite
                        </basic-button>
                    </p>
                </li>
            </ul>
        </template>
    </b-modal>
</template>

<script>
import { api } from '~/services'
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

const MIN_SEARCH_LENGTH = 3
const MAX_RESULTS = 5
const STATUS_IDLE = 'idle'
const STATUS_SEARCHING = 'searching'
const STATUS_SHOW_RESULTS = 'done'

export default {
    name: 'UserSearchModal',
    data() {
        return {
            open: false,
            status: STATUS_IDLE,
            searchText: null,
            results: [
                // e.g.
                // {
                //     id: null,
                //     name: null,
                //     photo: null,
                // },
            ],
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
        }),
        isIdle() {
            return this.status === STATUS_IDLE
        },
        isSearching() {
            return this.status === STATUS_SEARCHING
        },
        isShowResults() {
            return this.status === STATUS_SHOW_RESULTS
        },
    },
    watch: {
        searchText(newValue) {
            if (newValue) {
                this.status = STATUS_SEARCHING
                this.debounceSeach()
            } else {
                this.status = STATUS_IDLE
            }
        },
    },
    created() {
        this.$bus.$on('modal.userSearch.open', this.handleOpen)
        this.debounceSeach = debounce(this.search, 500)
    },
    methods: {
        close() {
            this.open = false
        },
        async search() {
            if (!this.searchText) {
                return
            }

            if (this.searchText.length < MIN_SEARCH_LENGTH) {
                this.status = STATUS_SHOW_RESULTS
                return
            }

            const { status, data } = await api.users.searchCollab({
                userId: this.user.id,
                search: this.searchText,
            })

            if (!this.searchText) {
                this.status = STATUS_IDLE
                return
            }

            if (status === 'success') {
                this.results = data
                    .slice(0, MAX_RESULTS)
                    .map(({ id, user_name, data_image }) => {
                        return {
                            id,
                            name: user_name,
                            photo: data_image,
                        }
                    })
            }

            this.status = STATUS_SHOW_RESULTS
        },
        handleInviteClick() {
            this.close()
            this.$bus.$emit('modal.userInvite.open')
        },
        handleUserClick(user) {
            this.close()
            this.$bus.$emit('modal.userSearch.userSelected', user)
        },
        handleOpen() {
            this.open = true
        },
    },
}
</script>
