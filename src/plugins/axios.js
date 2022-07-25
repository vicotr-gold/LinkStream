import axios from 'axios'
import app from '~/main'

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
})

instance.interceptors.request.use(
    config => {
        if (config.showProgress) {
            // For every request start the progress
            app.$Progress.start()
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        if (response.config.showProgress) {
            // Stop progress when a response is received
            app.$Progress.finish()
        }
        return response
    },
    error => {
        if (error.config.showProgress) {
            // Stop progress when a response is received
            app.$Progress.finish()
        }
        return Promise.reject(error)
    }
)

export default instance
