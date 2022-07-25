import { commonTypes, loadingTypes } from '../mutationTypes'

const initialState = () => ({
    status: 'idle', // idle, started, done
})

const state = initialState()

const mutations = {
    [commonTypes.RESET](state) {
        const s = initialState()
        for (let key in state) {
            state[key] = s[key]
        }
    },
    [loadingTypes.SET_STATUS](state, { status }) {
        state.status = status
    },
}

const actions = {
    reset({ commit }) {
        commit(commonTypes.RESET)
    },
    show({ commit }) {
        commit({
            type: loadingTypes.SET_STATUS,
            status: 'started',
        })
    },
    hide({ commit }) {
        commit({
            type: loadingTypes.SET_STATUS,
            status: 'done',
        })
    },
}

const getters = {
    isStarted: ({ status }) => status === 'started',
    isDone: ({ status }) => status === 'done',
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
