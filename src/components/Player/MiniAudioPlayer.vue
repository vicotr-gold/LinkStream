<template>
    <div
        class="MiniAudioPlayer"
        :class="{
            'is-playing': playing,
            'is-loading': loading,
        }"
    >
        <span class="player-spinner spinner-border"></span>
        <BasicButton
            variant="icon"
            class="player-play-btn"
            :disabled="loading"
            @click="handlePlayClick"
        />
    </div>
</template>

<script>
import { api } from '~/services/api'

const STATE_PAUSED = 'paused'
const STATE_PLAYING = 'playing'
const STATE_LOADING = 'loading'

export default {
    name: 'MiniAudioPlayer',
    props: {
        src: {
            type: String,
        },
    },
    data() {
        return {
            audioObj: null,
            state: STATE_PAUSED,
        }
    },
    computed: {
        playing() {
            return this.state === STATE_PLAYING
        },
        loading() {
            return this.state === STATE_LOADING
        },
    },
    beforeDestroy() {
        this.audioObj && this.audioObj.pause()
    },
    methods: {
        load(src) {
            this.audioObj = new Audio()
            this.audioObj.addEventListener('playing', this.handlePlaying)
            this.audioObj.addEventListener('pause', this.handlePause)
            this.audioObj.addEventListener('error', this.handleError)
            this.audioObj.addEventListener('ended', this.handleEnded)
            this.audioObj.src = src
            this.audioObj.load()
        },
        async handlePlayClick() {
            if (!this.src) {
                this.$toast.error('No source provided.')
                return
            }

            if (!this.audioObj) {
                if (this.src.charAt(0) === '/') {
                    this.state = STATE_LOADING
                    const { status, data } = await api.call({
                        endpoint: this.src,
                        showProgress: false,
                    })
                    if (status === 'success') {
                        this.load(data.audio)
                    } else {
                        this.state = STATE_PAUSED
                        this.$toast.error('Failed to fetch audio.')
                        return
                    }
                } else {
                    // Base64 audio
                    this.load(this.src)
                }
            }

            if (this.playing) {
                this.audioObj.pause()
            } else {
                this.audioObj
                    .play()
                    .then(() => {})
                    .catch(e => {
                        this.$toast.error(e.message)
                    })
            }
        },
        handlePlaying() {
            this.state = STATE_PLAYING
        },
        handlePause() {
            this.state = STATE_PAUSED
        },
        handleEnded() {
            this.state = STATE_PAUSED
        },
        handleError() {
            this.audioObj = null
            this.state = STATE_PAUSED
        },
    },
}
</script>