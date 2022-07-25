import Vue from 'vue'

Vue.filter('truncate', function(value, maxLength = 8) {
    return value.length > maxLength
        ? value.substring(0, maxLength) + '...'
        : value
})
