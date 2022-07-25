<template>
    <div class="beats-multiselect-container">
        <div
            class="MultiSelect beats-multiselect"
            ref="multiselect"
            :class="{
                'is-open': showDropdown,
            }"
        >
            <SearchInput
                :placeholder="placeholder"
                @focus="handleInputFocus"
                v-model.trim="filterText"
            />
            <div class="select-menu">
                <ul v-if="filteredOptions.length">
                    <li
                        class="select-option"
                        v-for="option in filteredOptions"
                        :key="option.id"
                        @click="handleOptionClick(option)"
                    >
                        <div class="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                class="custom-control-input"
                                :checked="
                                    !!value.find(
                                        ({ id }) => id == option.id
                                    )
                                "
                            />
                            <label class="custom-control-label"></label>
                        </div>
                        <div class="option-cover">
                            <span
                                class="lock-overlay"
                                v-if="option.isPrivate"
                            ></span>
                            <img
                                :src="option.coverart"
                                :alt="option.title"
                            />
                        </div>
                        <div>
                            <h4 class="option-title">
                                {{ option.title }}
                            </h4>
                            <small>
                                {{ genreLabelById(option.genre_id) }}
                            </small>
                        </div>
                    </li>
                </ul>
                <div v-else class="select-empty">
                    <span v-if="options.length">
                        No matching beats.
                    </span>
                    <span v-else>
                        You don't have any beats.
                        <br />
                        <basic-button
                            variant="link"
                            :to="{ name: 'accountBeatAdd' }"
                        >
                            Add a Beat
                        </basic-button>
                    </span>
                </div>
            </div>
        </div>
        
        <BeatPackList
            :beatPacks="value"
            @remove-item="handleBeatPackRemove"
        />
    </div>
</template>
<script>
import BeatPackList from '~/components/Account/Tracks/Beats/BeatPackList'
import { mapGetters } from 'vuex'
export default {
    name: 'BeatPacksMultiSelect',
    components: {
        BeatPackList
    },
    props: {
        placeholder: {
            type: String,
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            filterText: null,
            showDropdown: false,
        }
    },
    computed: {
        ...mapGetters({
            options: 'me/relatedBeatPacks',
            genreLabelById: 'common/genreLabelById',
        }),
        filteredOptions() {
            if (!this.filterText) {
                return this.options
            }
            return this.options.filter(
                option =>
                    option.title
                        .toLowerCase()
                        .indexOf(this.filterText.toLowerCase()) !== -1
            )
        },
    },
    async created() {
        await this.$store.dispatch('me/loadBeatPacks')
        await this.$store.dispatch('me/loadRelatedBeatPacks')    
    },
    mounted() {
        document.addEventListener('click', this.handleDocumentClick)
    },
    methods: {
        handleInputFocus() {
            this.showDropdown = true
        },
        handleDocumentClick(e) {
            const el = this.$refs.multiselect
            if (!el) {
                return
            }
            const clickedOutside = !el.contains(e.target)
            if (clickedOutside) {
                this.showDropdown = false
            }
        },
        handleOptionClick(option) {
            const selectedOptions = [...this.value]
            const optionIndex = selectedOptions.findIndex(
                selectedOption =>
                    selectedOption.id == option.id
            )
            if (optionIndex === -1) {
                selectedOptions.push(option)
            } else {
                selectedOptions.splice(optionIndex, 1)
            }
            this.$emit('input', selectedOptions)
        },
        handleBeatPackRemove(index) {
            this.value.splice(index, 1)
        },
    }
}
</script>