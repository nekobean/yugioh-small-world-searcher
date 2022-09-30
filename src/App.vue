<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      スモールワールド検索ツール
      <v-radio-group v-model="lang" mandatory row hide-details class="ml-5">
        <v-radio v-for="x in langs" :key="x" :label="x" :value="x"></v-radio>
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
    </v-app-bar>

    <v-main>
      <Home :lang="lang" />
    </v-main>
  </v-app>
</template>

<script>
import Home from "./components/Home.vue";

export default {
  name: "App",
  components: { Home },
  data() {
    return {
      lang: "jp",
      langs: ["JP", "EN"],
    };
  },
};
</script>
