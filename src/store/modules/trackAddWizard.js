import { commonTypes, trackAddWizardTypes } from '../mutationTypes'
import { appConstants } from '~/constants'
import { cloneDeep } from 'lodash'
import { required } from 'vuelidate/lib/validators'

const initialState = () => ({
    licenses: [],
    // Free download options
    freeDls: [...appConstants.marketingOptions],
    // Form values
    form: {
        selectedLicenseIds: [],
        selectedFreeDlIds: [],
        trackType: 2, // 1=Song, 2=Beat
        coverArtBase64: null,
        title: null,
        genre: {},
        tags: [],
        bpm: null,
        key: {},
        trackPack: null,
        time: null,
        date: null,
        scheduled: false,
        isPublic: false,
        files: {
            // e.g.
            // tagged: {
            //     name: null,
            //     base64: null,
            // },
            stems: null,
            tagged: null,
            untaggedMp3: null,
            untaggedWav: null,
        },
        collabs: [
            // e.g.
            // {
            //     profit: null,
            //     publishing: null,
            //     user: {
            //         id: null,
            //         name: null,
            //         photo: null,
            //     },
            // },
        ],
    },
})

const state = initialState()

const mutations = {
    [commonTypes.RESET](state) {
        const s = initialState()
        for (let key in state) {
            state[key] = s[key]
        }
    },

    [trackAddWizardTypes.UPDATE_FORM](state, { values }) {
        const form = { ...state.form }
        for (let k in values) {
            if (k in form) {
                form[k] = cloneDeep(values[k])
            }
        }
        state.form = form
    },

    [trackAddWizardTypes.SET_LICENSES](state, { licenses }) {
        state.licenses = cloneDeep(licenses)
    },

    [trackAddWizardTypes.UPDATE_LICENSE](state, { index, license }) {
        state.licenses.splice(index, 1, cloneDeep(license))
    },
}

const actions = {
    reset({ commit }) {
        commit(commonTypes.RESET)
    },

    async updateForm({ commit }, values) {
        commit({
            type: trackAddWizardTypes.UPDATE_FORM,
            values,
        })
    },

    async updateLicense({ state, commit }, license) {
        const index = state.licenses.findIndex(({ id }) => id == license.id)
        commit({
            type: trackAddWizardTypes.UPDATE_LICENSE,
            index,
            license,
        })
    },

    async loadUserLicenses({ commit, dispatch, rootGetters }) {
        await dispatch('me/loadLicenses', null, { root: true })
        commit({
            type: trackAddWizardTypes.SET_LICENSES,
            licenses: rootGetters['me/licenses'],
        })
    },

    async loadWizard({ dispatch }) {
        await dispatch('loadUserLicenses')
        await dispatch('common/loadGenres', null, { root: true })
        await dispatch('common/loadAudioKeys', null, { root: true })
        
    },
}

const getters = {
    isSong: ({ form }) => form.trackType == appConstants.tracks.types.song,
    licenses: ({ licenses }) => licenses,
    freeDls: ({ freeDls }) => freeDls,
    selectedLicenses: ({ form, licenses }) => {
        return licenses.filter(
            ({ id }) => form.selectedLicenseIds.indexOf(id) !== -1
        )
    },
    selectedFreeDls: ({ form, freeDls }) => {
        return freeDls.filter(
            ({ id }) => form.selectedFreeDlIds.indexOf(id) !== -1
        )
    },
    validations: (state, getters) => {
        const rules = {
            files: {
                stems: {},
                untaggedMp3: {},
                untaggedWav: {},
            },
        }
        getters.selectedLicenses.forEach(({ mp3, wav, trackout_stems }) => {
            if (mp3 === '1') {
                rules.files.untaggedMp3 = { required }
            }
            if (wav === '1') {
                rules.files.untaggedWav = { required }
            }
            if (trackout_stems === '1') {
                rules.files.stems = { required }
            }
        })
        return rules
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
