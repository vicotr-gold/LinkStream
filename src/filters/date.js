import Vue from 'vue'
import moment from 'moment'

Vue.filter('relativeDate', function(value) {
    const now = moment()
    const date = moment(value)
    const difference = moment.duration(now.diff(date))
    return difference.humanize()
})

Vue.filter('simpleDate', function(value) {
    return moment(value).format('L')
})

Vue.filter('normalDate', function(value) {
    return moment(value).format('MMM D, YYYY')
})

Vue.filter('shortDate', function(value) {
    return moment(value).format('MMM D')
})

Vue.filter('longDate', function(value) {
    return moment(value).format('ddd, MMM D, YYYY')
})

Vue.filter('customizeDate', function(value, format) {
    return moment(value).format(format)
})

Vue.filter('mmddyyyy', function(value) {
    return moment(value).format('MM/DD/YYYY')
})
