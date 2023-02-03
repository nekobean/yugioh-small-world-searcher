<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div>
        <h1 class="text-h5">{{ $t("header.appTitle") }}</h1>
        <span class="subtitle-1">
          {{ $t("header.appVersion") }}: {{ version }}
          {{ $t("header.cardDataUpdateDate") }}: 2022/2/1
        </span>
      </div>
      <v-radio-group
        v-model="$i18n.locale"
        mandatory
        row
        hide-details
        class="ml-5"
      >
        <v-radio
          v-for="x in langs"
          :key="x.name"
          :label="x.name"
          :value="x.value"
        ></v-radio>
      </v-radio-group>

      <v-spacer></v-spacer>

      <v-btn
        href="https://pystyle.info/yugioh-small-world-searcher/"
        target="_blank"
        text
      >
        <span class="mr-2">ツールの概要</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn
        href="https://pystyle.info/apps/yugioh-probability-simulator/"
        target="_blank"
        text
      >
        <span class="mr-2">初動確率計算ツール</span>
        <v-icon>mdi-calculator</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="min-width: 1200px">
      <Home :lang="lang" />
    </v-main>

    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ $t("appendix.github") }}:
        <a
          href="https://github.com/nekobean/yugioh-small-world-searcher/"
          target="_blank"
          >yugioh-small-world-searcher</a
        >
        / {{ $t("appendix.author") }}:
        <a href="https://pystyle.info/" target="_blank"> pystyle </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { version } from "../package";
import Home from "./components/Home.vue";

export default {
  name: "App",
  components: { Home },
  data() {
    return {
      version: version,
      lang: "jp",
      langs: [
        {
          name: "日本語",
          value: "ja",
        },
        {
          name: "English",
          value: "en",
        },
      ],
    };
  },
};
</script>
