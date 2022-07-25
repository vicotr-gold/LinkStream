<template>
    <div class="page page-beat-add">
        <div class="page-body">
            <Wizard />
            <UserInviteModal />
            <UserSearchModal />
            <InfoEditModal />
            <LicensesEditModal />
            <FilesEditModal />
            <MarketingEditModal />
        </div>
    </div>
</template>

<script>
import { UserInviteModal, UserSearchModal } from '~/components/Modal'

import {
    Wizard,
    InfoEditModal,
    LicensesEditModal,
    FilesEditModal,
    MarketingEditModal,
} from '~/components/Account/Tracks/AddTrackWizard'

export default {
    name: 'BeatAdd',
    components: {
        Wizard,
        UserInviteModal,
        UserSearchModal,
        InfoEditModal,
        LicensesEditModal,
        FilesEditModal,
        MarketingEditModal,
    },
}
</script>
