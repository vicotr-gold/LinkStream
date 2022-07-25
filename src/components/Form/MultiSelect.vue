<template>
    <div
        class="MultiSelect"
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
                    :key="option[optionIdKey]"
                    @click="handleOptionClick(option)"
                >
                    <slot
                        name="option-content"
                        :option="option"
                        :selected="value"
                    >
                        <div class="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                class="custom-control-input"
                                :checked="
                                    !!value.find(
                                        selectedOption =>
                                            selectedOption[optionIdKey] ==
                                            option[optionIdKey]
                                    )
                                "
                            />
                            <label class="custom-control-label"></label>
                        </div>
                        {{ option[optionLabelKey] }}
                    </slot>
                </li>
            </ul>
            <div v-else class="select-empty">
                <slot name="select-empty" :options="options">
                    {{ options.length ? msgNoMatch : msgNoOptions }}
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MultiSelect',
    props: {
        placeholder: {
            type: String,
        },
        options: {
            type: Array,
            default: () => [],
        },
        value: {
            type: Array,
            default: () => [],
        },
        optionIdKey: {
            type: String,
            default: 'id',
        },
        optionLabelKey: {
            type: String,
            default: 'title',
        },
        msgNoOptions: {
            type: String,
        },
        msgNoMatch: {
            type: String,
            default: 'No matching options.',
        },
    },
    data() {
        return {
            filterText: null,
            showDropdown: false,
        }
    },
    computed: {
        filteredOptions() {
            if (!this.filterText) {
                return this.options
            }
            return this.options.filter(
                option =>
                    option[this.optionLabelKey]
                        .toLowerCase()
                        .indexOf(this.filterText.toLowerCase()) !== -1
            )
        },
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
            const optionIdKey = this.optionIdKey
            const selectedOptions = [...this.value]
            const optionIndex = selectedOptions.findIndex(
                selectedOption =>
                    selectedOption[optionIdKey] == option[optionIdKey]
            )
            if (optionIndex === -1) {
                selectedOptions.push(option)
            } else {
                selectedOptions.splice(optionIndex, 1)
            }
            this.$emit('input', selectedOptions)
        },
    },
}
</script>