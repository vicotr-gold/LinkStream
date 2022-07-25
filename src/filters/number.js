import Vue from 'vue'

Vue.filter('trimZeroDecimal', function(value) {
    return value.toString().replace('.00', '')
})
