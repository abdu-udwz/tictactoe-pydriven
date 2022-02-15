import Vue from 'vue'

import VueCompositionAPI from '@vue/composition-api'

import vuetify from '@/plugins/vuetify'

import App from '@/App.vue'

Vue.use(VueCompositionAPI)


const app = new Vue({
  render: h => h(App),
  vuetify,
})

app.$mount('#app')
