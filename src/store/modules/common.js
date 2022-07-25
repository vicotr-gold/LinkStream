import { commonTypes } from '../mutationTypes'
import { api } from '~/services'

const initialState = () => ({
    timezones: [],
    genres: [],
    audioKeys: [],
})

const state = initialState()

const mutations = {
    [commonTypes.SET_TIMEZONES](state, { timezones }) {
        state.timezones = timezones
    },

    [commonTypes.SET_GENRES](state, { genres }) {
        state.genres = genres
    },

    [commonTypes.SET_AUDIO_KEYS](state, { audioKeys }) {
        state.audioKeys = audioKeys
    },
}

const actions = {
    async loadTimezones({ state, commit }) {
        if (state.timezones.length) {
            return
        }
        const { status, data } = await api.common.getTimezones()
        commit({
            type: commonTypes.SET_TIMEZONES,
            timezones: status === 'success' ? data : [],
        })
    },

    async loadGenres({ state, commit }) {
        if (state.genres.length) {
            return
        }
        const { status, data } = await api.common.getGenres()
        commit({
            type: commonTypes.SET_GENRES,
            genres: status === 'success' ? data : [],
        })
    },

    async loadAudioKeys({ state, commit }) {
        if (state.audioKeys.length) {
            return
        }
        const { status, data } = await api.audios.getKeys()
        commit({
            type: commonTypes.SET_AUDIO_KEYS,
            audioKeys: status === 'success' ? data : [],
        })
    },
}

const getters = {
    genres: ({ genres }) => genres,
    audioKeys: ({ audioKeys }) => audioKeys,
    genreLabelById: ({ genres }) => {
        return id => {
            const genre = genres.find(genre => genre.id == id)
            return genre ? genre.genre : ''
        }
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
