import AlertBox from '~/components/Alert/AlertBox'

export default {
    install(Vue) {
        Vue.prototype.$alert = new Vue(AlertBox).$mount()
    },
}
