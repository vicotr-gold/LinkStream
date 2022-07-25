import { mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import { helpers } from 'vuelidate/lib/validators'
import moment from 'moment'

export const videoAddEditForm = {
    created() {
        this.$store.dispatch('common/loadGenres')
        this.$store.dispatch('me/loadRelatedTracks')
    },
    data() {
        return {
            saving: false,
            form: {
                url: null,
                title: null,
                genre: null,
                relatedTrack: null,
                visibility: 2,
                scheduled: null,
                date: null,
                time: null,
            },
        }
    },
    computed: {
        ...mapGetters({
            user: ['me/user'],
            genres: ['common/genres'],
            relatedTracks: ['me/relatedTracks'],
        }),
        ytVidId() {
            return this.$youtube.getIdFromUrl(this.form.url)
        },
    },
    validations: {
        form: {
            url: {
                required,
                valid(value) {
                    return (
                        !helpers.req(value) ||
                        !!this.$youtube.getIdFromUrl(value)
                    )
                },
            },
            title: {
                required,
                minLength: minLength(10),
            },
        },
    },
    methods: {
        handleSaveClick() {
            this.save()
        },
        async save() {
            this.$v.form.$touch()

            if (this.$v.form.$invalid) {
                return
            }

            this.saving = true

            const {
                url,
                title,
                genre,
                relatedTrack,
                visibility,
                date,
                time,
                scheduled,
            } = this.form

            const params = {
                user_id: this.user.id,
                url,
                title,
                genre_id: genre,
                related_track: relatedTrack,
                public: visibility,
                scheduled: scheduled ? 1 : 0,
                date: scheduled ? moment(date).format('YYYY-MM-DD') : null,
                time: scheduled ? time : null,
            }

            const { status, error, message } = this.video
                ? await this.$store.dispatch('me/updateVideo', {
                      id: this.video.id,
                      params,
                  })
                : await this.$store.dispatch('me/createVideo', {
                      params,
                  })

            if (status === 'success') {
                this.$toast.success(message)
                if (this.video) {
                    this.close()
                } else {
                    this.$router.push({ name: 'accountVideos' })
                }
            } else {
                this.$toast.error(error)
            }

            this.saving = false
        },
    },
}
