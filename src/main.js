import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueI18n from "vue-i18n";
import axios from "axios";
import VueAxios from "vue-axios";
import VueMeta from "vue-meta";
import VueClipboard from "vue-clipboard2";
import VueSocialSharing from "vue-social-sharing";
import VueGtag from "vue-gtag";
import Ads from "vue-google-adsense";

Vue.config.productionTip = false;

// vue-google-adsense の設定
Vue.use(require("vue-script2"));
Vue.use(Ads.AutoAdsense, { adClient: "ca-pub-9930040906284502" });
Vue.use(Ads.Adsense);

// vue-gtag の設定
Vue.use(VueGtag, {
  config: { id: "G-GDCFWZN645" },
});

// vue-axios の設定
Vue.use(VueAxios, axios);

// Vue I18n の設定
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "ja",
  messages: {
    ja: require("../lang/ja.json"),
    en: require("../lang/en.json"),
  },
});

// Vue Meta の設定
Vue.use(VueMeta);

// vue-clipboard2 の設定
Vue.use(VueClipboard);

// vue-social-sharing の設定
Vue.use(VueSocialSharing);

new Vue({
  router,
  vuetify,
  i18n: i18n,
  render: (h) => h(App),
}).$mount("#app");
