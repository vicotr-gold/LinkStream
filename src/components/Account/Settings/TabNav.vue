<template>
    <ul>
        <li
            v-for="tab in tabs"
            :key="tab.routeName"
            :class="{ active: $route.name === tab.routeName }"
        >
            <router-link :to="{ name: tab.routeName }">
                {{ tab.label }}
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'TabNav',
    data() {
        return {
            tabs: [
                { label: 'Purchases', routeName: 'accountSettingsPurchases' },
                { label: 'Account', routeName: 'accountSettingsInfo' },
                { label: 'Payments', routeName: 'accountSettingsPayments' },
                { label: 'Payouts', routeName: 'accountSettingsPayouts' },
                { label: 'Notifications', routeName: 'accountSettingsNotifs' },
            ],
        }
    },
}
</script>