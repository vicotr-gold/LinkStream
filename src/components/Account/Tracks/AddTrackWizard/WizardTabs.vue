<template>
    <nav class="fwz-tabs">
        <ul>
            <li
                v-for="(tab, index) in tabs"
                :key="index"
                :class="{
                    active: tab.step === activeStepName,
                    done: index < activeStepIndex,
                }"
                @click="handleTabClick(tab)"
            >
                {{ index + 1 }}. {{ tab.text }}&nbsp;
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'WizardTabs',
    props: {
        tabs: {
            type: Array,
        },
        activeStepName: {
            type: String,
        },
        activeStepIndex: {
            type: Number,
        },
    },
    methods: {
        handleTabClick(tab) {
            this.$emit('tab-click', tab)
        },
    },
}
</script>