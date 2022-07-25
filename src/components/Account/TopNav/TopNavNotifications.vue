<template>
    <div class="notifs position-relative d-inline-block">
        <b-dropdown
            variant="link"
            size="md"
            right
            toggle-class="text-decoration-none"
            menu-class="position-absolute notifs-menu px-3 py-0"
            no-caret
        >
            <template slot="button-content">
                <font-awesome-icon
                    :icon="['fas', 'bell']"
                    class="text-white"
                    size="2x"
                />
                <!--<b-badge pill variant="danger count">3</b-badge>-->
            </template>
            <vue-perfect-scrollbar
                :settings="{ suppressScrollX: true, wheelPropagation: false }"
            >
                <div
                    class="d-flex flex-row p-2"
                    :class="{ 'border-top': index > 0 }"
                    v-for="(notification, index) in notifications"
                    :key="index"
                >
                    <b-img
                        :src="
                            require(`@/assets/img/profile/${notification.img}`)
                        "
                        :alt="notification.title"
                        rounded="circle"
                        class="avatar"
                    />
                    <div class="pl-3 pr-2">{{ notification.title }}</div>
                    <div class="d-flex justify-content-center">
                        <spinner-button class="pink">
                            Follow
                        </spinner-button>
                    </div>
                </div>
            </vue-perfect-scrollbar>
        </b-dropdown>
    </div>
</template>

<script>
import notifications from '~/data/notifications'

export default {
    name: 'TopNavNotifications',
    data() {
        return {
            notifications: [],
        }
    },
}
</script>
