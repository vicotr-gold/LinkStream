import Vue from 'vue'
import Cleave from 'cleave.js'

Vue.directive('cleave', {
    inserted(el, binding) {
        el.cleave = new Cleave(el, binding.value || {})
        el.onkeyup = function() {
            const event = new Event('input', { bubbles: true })
            setTimeout(function() {
                el.value = el.cleave.properties.result
                el.dispatchEvent(event)
            }, 100)
        }
    },
})
