import { appConstants } from '~/constants'
import Cookies from 'js-cookie'

export const getAuthCookie = () =>
    Cookies.getJSON(appConstants.cookies.auth.name)

export const setAuthCookie = ({ id, token }) => {
    Cookies.set(
        appConstants.cookies.auth.name,
        { id, token },
        {
            expires: appConstants.cookies.auth.expires,
            secure: process.env === 'production',
        }
    )
}

export const getPendingUserCookie = () =>
    Cookies.getJSON(appConstants.cookies.pendingUser.name)

export const setPendingUserCookie = value => {
    Cookies.set(appConstants.cookies.pendingUser.name, value, {
        expires: appConstants.cookies.pendingUser.expires,
        secure: process.env === 'production',
    })
}

export function clearLocalStorage() {
    Cookies.remove(appConstants.cookies.auth.name)
    Cookies.remove(appConstants.cookies.pendingUser.name)
    window.localStorage &&
        window.localStorage.removeItem(appConstants.vuexLocalStorage.key)
}
