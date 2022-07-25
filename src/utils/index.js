import { set } from 'lodash'

/**
 * Change the status of target object for duration.
 * This function is useful to change status in animations.
 *
 * @param {<Object>} obj
 * @param {<String>} target
 * @param {<Boolean>} value
 * @param {<Function>} callback
 * @param {<Number>} duration
 * @return
 */
export const setStatusChange = function(
    obj,
    target,
    value = true,
    callback = null,
    duration = 3000
) {
    set(obj, target, value)
    setTimeout(() => {
        if (callback) {
            callback()
        }
        set(obj, target, null)
    }, duration)
}

/**
 * Get YouTube video thumb URL.
 * @param {string} videoId
 * @return {string}
 */
export const getYtVideoThumbUrl = videoId =>
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

/**
 * Generate time picker options.
 * @return {array}
 */
export const generateTimePickerOptions = function() {
    const options = []
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const h24 = h < 10 ? `0${h}` : h
            const m24 = m < 10 ? `0${m}` : m
            const h12 = h24 % 12 || 12
            const m12 = m24 || '00'
            const amPm = h > 11 ? 'pm' : 'am'
            const t24 = `${h24}:${m24}:00`
            const t12 = `${h12}:${m12} ${amPm}`
            options.push({
                id: t24,
                title: t12,
            })
        }
    }
    return options
}

/**
 * Strip commas from thousands numeric string.
 * @param {string} value
 * @return {string}
 */
export const stripCommas = function(value) {
    return value ? value.toString().replace(/,/g, '') : ''
}

/**
 * Scoll to top of page.
 */
export const scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
