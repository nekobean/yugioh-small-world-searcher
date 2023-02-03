import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import VueAxios from 'vue-axios'

// vue-axios の設定
Vue.use(VueAxios, axios)

// Vue I18n の設定
Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'ja',
    messages: {
        ja: require('../lang/ja.json'),
        en: require('../lang/en.json'),
    }
});

Vue.config.productionTip = false

new Vue({
    vuetify,
    i18n: i18n,
    render: h => h(App)
}).$mount('#app')
