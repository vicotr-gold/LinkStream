<template>
    <b-modal modal-class="LinkScheduleModal" centered v-model="open">
        <template v-slot:modal-header>
            <BasicButton variant="icon" class="modal-close" @click="close" />
            <h2 class="modal-title">Schedule link</h2>
        </template>

        <template v-slot:default>
            <div class="form-group">
                <b-form-group label="Start Date">
                    <b-input-group class="date-input-group">
                        <DatePicker v-model="form.date" />
                        <TimePicker v-model="form.time" />
                    </b-input-group>
                    <b-form-invalid-feedback
                        :state="!($v.form.date.$error || $v.form.time.$error)"
                    >
                        Pick start date and time
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group>
                    <b-form-checkbox
                        :checked="showEndDate"
                        @change="handleEndDateCheckChange"
                    >
                        Set end date
                    </b-form-checkbox>
                </b-form-group>

                <b-form-group label="End Date" v-show="showEndDate">
                    <b-input-group class="date-input-group">
                        <DatePicker v-model="form.endDate" />
                        <TimePicker v-model="form.endTime" />
                    </b-input-group>
                    <b-form-invalid-feedback
                        :state="
                            !($v.form.endDate.$error || $v.form.endTime.$error)
                        "
                    >
                        Pick end date and time
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>
        </template>

        <template v-slot:modal-footer>
            <basic-button
                class="action-btn cancel-btn"
                variant="secondary"
                @click="close"
            >
                Cancel
            </basic-button>
            <spinner-button
                class="action-btn"
                :loading="loading"
                @click="handleSaveClick"
            >
                Save
            </spinner-button>
        </template>
    </b-modal>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
    name: 'LinkScheduleModal',
    data() {
        return {
            open: false,
            loading: false,
            showEndDate: false,
            form: {
                date: null,
                time: null,
                endDate: null,
                endTime: null,
            },
        }
    },
    validations: {
        form: {
            date: {
                required,
            },
            time: {
                required,
            },
            endDate: {
                required: requiredIf(function() {
                    return this.showEndDate
                }),
            },
            endTime: {
                required: requiredIf(function() {
                    return this.showEndDate
                }),
            },
        },
    },
    created() {
        this.$bus.$on('modal.linkSchedule.open', this.handleOpen)
    },
    methods: {
        close() {
            this.open = false
        },
        handleEndDateCheckChange() {
            this.$v.form.endDate.$reset()
            this.$v.form.endTime.$reset()
            this.showEndDate = !this.showEndDate
        },
        handleOpen(link) {
            this.$v.form.$reset()
            this.link = { ...link }
            this.showEndDate = false
            this.form = {
                date: null,
                time: null,
                endDate: null,
                endTime: null,
            }
            if (this.link.scheduled) {
                const { date, time, end_date, end_time } = this.link
                this.showEndDate = !!(end_date && end_time)
                this.form = {
                    ...this.form,
                    date: new Date(date + ' 00:00:00'),
                    time,
                }
                if (this.showEndDate) {
                    this.form = {
                        ...this.form,
                        endDate: new Date(end_date + ' 00:00:00'),
                        endTime: end_time,
                    }
                }
            }
            this.open = true
        },
        async handleSaveClick() {
            this.$v.form.$touch()

            if (this.$v.form.$invalid) {
                return
            }

            this.loading = true

            const { date, time, endDate, endTime } = this.form

            const params = {
                scheduled: 1,
                date: moment(date).format('YYYY-MM-DD'),
                time,
                end_date: null,
                end_time: null,
            }

            if (this.showEndDate) {
                params.end_date = moment(endDate).format('YYYY-MM-DD')
                params.end_time = endTime
            }

            const { status, message, error } = await this.$store.dispatch(
                'me/updateLink',
                {
                    id: this.link.id,
                    params,
                }
            )

            if (status === 'success') {
                this.close()
                this.$toast.success(message)
            } else {
                this.$toast.error(error)
            }

            this.loading = false
        },
    },
}
</script>
