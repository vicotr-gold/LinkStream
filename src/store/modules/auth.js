import { commonTypes, authTypes } from '../mutationTypes'
import { api } from '~/services/api'
import router from '~/router'
import { isEmpty } from 'lodash'
import {
    getAuthCookie,
    setAuthCookie,
    getPendingUserCookie,
    setPendingUserCookie,
    clearLocalStorage,
} from '~/utils/auth'

const initialState = () => ({
    /**
     * @type {object}
     */
    user: null,
    /**
     * @type {object}
     */
    pendingUser: null,
})

const state = {
    user: getAuthCookie(),
    pendingUser: getPendingUserCookie(),
}

const mutations = {
    [commonTypes.RESET](state) {
        const s = initialState()
        for (let key in state) {
            state[key] = s[key]
        }
    },

    [authTypes.SIGNUP](state, { user }) {
        state.pendingUser = user
    },

    [authTypes.LOGIN](state, { user }) {
        const { id, token } = user
        state.user = { id, token }
    },
}

const actions = {
    reset({ commit }) {
        commit(commonTypes.RESET)
    },

    signup({ commit }, { user }) {
        if (!isEmpty(user)) {
            commit(authTypes.SIGNUP, { user })
            setPendingUserCookie(user)
            router.push({ name: 'signupConfirm' })
        }
    },

    async login({ commit, dispatch }, { user }) {
        if (!isEmpty(user)) {
            commit(commonTypes.RESET)
            commit(authTypes.LOGIN, { user })
            setAuthCookie({ id: user.id, token: user.token })
            await dispatch('me/loadAccount', null, { root: true })
            router.push({ name: 'accountDashboard' })
        }
    },

    async logout({ dispatch }) {
        await api.users.logout()
        dispatch('reset')
        dispatch('me/reset', null, { root: true })
        clearLocalStorage()
    },
}

const getters = {
    user: ({ user }) => user,
    isLoggedIn: ({ user }) => {
        return () => !!(getAuthCookie() && user)
    },
    token: ({ user }) => (user ? user.token : null),
    pendingUser: ({ pendingUser }) => pendingUser,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
