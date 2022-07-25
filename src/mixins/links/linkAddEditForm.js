import { mapGetters } from 'vuex'
import { DropImage } from '~/components/Uploader'
import { required, url } from 'vuelidate/lib/validators'
import moment from 'moment'

export const linkAddEditForm = {
    components: {
        DropImage,
    },
    data() {
        return {
            isEditMode: false,
            processing: false,
            showEndDate: false,
            form: {
                url: null,
                title: null,
                coverArtBase64: null,
                visibility: 1,
                scheduled: null,
                date: new Date(),
                time: '00:00:00',
                endDate: new Date(),
                endTime: '00:00:00',
            },
        }
    },
    computed: {
        ...mapGetters({
            user: 'me/user',
        }),
    },
    watch: {
        isEditMode(newValue) {
            if (!newValue) {
                return
            }

            const { url, title, data_image } = this.link

            this.form = {
                ...this.form,
                url,
                title,
                coverArtBase64: data_image,
            }
        },
    },
    validations: {
        form: {
            url: {
                required,
                url,
            },
            title: {
                required,
            },
        },
    },
    methods: {
        handleImageAdd(file) {
            this.form.coverArtBase64 = file.base64
        },
        handleImageRemove() {
            this.form.coverArtBase64 = null
        },
        async handleSaveClick() {
            this.$v.form.$touch()

            if (this.$v.form.$invalid) {
                return
            }

            this.processing = true

            const {
                url,
                title,
                coverArtBase64,
                visibility,
                scheduled,
                date,
                time,
                endDate,
                endTime,
            } = this.form

            const params = {
                user_id: this.user.id,
                url,
                title,
            }

            if (this.isEditMode) {
                if (coverArtBase64 !== this.link.data_image) {
                    params.image = coverArtBase64
                }
            } else {
                params.image = coverArtBase64
                params.public = visibility
                if (scheduled) {
                    params.scheduled = 1
                    params.date = moment(date).format('YYYY-MM-DD')
                    params.time = time
                    if (this.showEndDate) {
                        params.end_date = moment(endDate).format('YYYY-MM-DD')
                        params.end_time = endTime
                    }
                }
            }

            const { status, message, error } = this.isEditMode
                ? await this.$store.dispatch('me/updateLink', {
                      id: this.link.id,
                      params,
                  })
                : await this.$store.dispatch('me/createLink', { params })

            if (status === 'success') {
                this.$toast.success(message)
                if (this.isEditMode) {
                    this.closeEditMode()
                } else {
                    this.$router.push({ name: 'accountLinks' })
                }
            } else {
                this.$toast.error(error)
            }

            this.processing = false
        },
    },
}
