<template>
    <VueTagsInput
        class="TaggerInput"
        v-model="tag"
        :separators="[';', ',']"
        :add-on-key="[13, ',', ';']"
        :placeholder="tags.length ? '' : 'Tags'"
        :tags="tags"
        @tags-changed="handleTagsChange"
    />
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'

export default {
    name: 'TaggerInput',
    components: {
        VueTagsInput,
    },
    props: {
        value: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            tag: this.value,
        }
    },
    methods: {
        handleTagsChange(value) {
            this.$emit('tags-changed', value)
        },
    },
}
</script>
