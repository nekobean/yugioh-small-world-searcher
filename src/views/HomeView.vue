<template>
  <div class="pa-3">
    <!--
        概要
    -->
    <h2 class="header-name text-h6">{{ $t("overview.title") }}</h2>

    <div class="ps-2 pt-2">
      <p class="ma-0" v-html="$t('overview.text')"></p>
      <p class="ma-0" v-html="$t('overview.text2')"></p>
      <div class="mt-3">
        <p class="ma-0">バージョン 1.3.1 (2023/11/7): 汎用カードを追加するショートカットボタンを追加、画像保存ボタンをクリックした場合に、点の位置を動かした状態が反映されるように修正</p>
        <p class="ma-0">バージョン 1.4.0 (2023/11/9): カードイラストを表示する機能を追加</p>
        <p class="ma-0">2024/2/13: カードデータ更新</p>
      </div>

      <v-btn color="#34c6eb" class="mt-3 ml-3" light rounded dark>
        <ShareNetwork network="twitter" :url="pageUrl" :title="'【' + $t('header.appTitle') + '】'"
          :description="$t('overview.tweetDescription')" :hashtags="$t('overview.tweetHashtags')"
          style="text-decoration: none; color: inherit">
          {{ $t("overview.tweet") }}
        </ShareNetwork>
      </v-btn>

      <hr class="my-3" />

      <div style="height: 500px">
        <Adsense data-ad-client="ca-pub-9930040906284502" data-ad-slot="9160643683" />
      </div>
    </div>

    <!--
        使い方
    -->
    <h2 class="header-name text-h6 mt-3">{{ $t("usage.title") }}</h2>

    <div class="ps-2 pt-2">
      <p class="ma-0">{{ $t("usage.text") }}</p>
    </div>

    <!--
        デッキ入力
    -->
    <h2 class="header-name text-h6 mt-3">{{ $t("addMonster.title") }}</h2>

    <div class="ps-2 pt-2">
      <p v-html="$t('addMonster.text')"></p>

      <!-- カード名入力欄 -->
      <v-text-field ref="monsterNameInput" :label="$t('addMonster.monsterNameInput.label')"
        :placeholder="$t('addMonster.monsterNameInput.placeholder')" clearable dense hide-details outlined
        persistent-placeholder style="width: 500px" @input="updateMonsterCandidates" append-icon="mdi-magnify">
      </v-text-field>

      <!-- カード一覧 -->
      <v-data-table v-if="deckCandidates.length" :footer-props="{ 'items-per-page-options': [15, 20, 50, -1] }"
        :headers="monstersTableHeader('add')" :items-per-page="15" :items="deckCandidates" :mobile-breakpoint="0"
        class="mt-5" dense>
        <!-- カード名 -->
        <template #[`item.name`]="{ item }">
          <a :href="officialUrl(item.id)" target="_blank">
            {{ item.name }}
          </a>
        </template>

        <!-- 効果 -->
        <template #[`item.prop`]="{ item }">
          <span>{{ item.prop.join($i18n.locale == "ja" ? "、" : ", ") }}</span>
        </template>

        <!-- カードテキスト -->
        <template #[`item.text`]="{ item }">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on" small>
                {{ $t("monstersTable.cardText") }}
              </v-btn>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </template>

        <!-- 追加ボタン -->
        <template #[`item.add`]="{ item }">
          <v-btn @click="
            addMonster(item);
          updateUrl();
          " color="primary" small>{{ $t("monstersTable.addButton") }}</v-btn>
        </template>
      </v-data-table>

      <div class="mt-3" style="max-width: 800px;" v-if="monsters">
        <v-btn v-for="monsterId in monsterIds" :key="monsterId" @click="
          addMonsterById(monsterId);
        updateUrl();
        " color="success" small class="mr-2 mt-3">{{ getMonsterName(monsterId) }}</v-btn>
      </div>
    </div>

    <!--
        デッキ
    -->
    <h2 class="header-name text-h6 mt-3">{{ $t("deck.title") }}</h2>

    <!-- カード一覧 -->
    <div class="ps-2 pt-2">
      <p v-html="$t('deck.text')"></p>

      <v-data-table v-if="deck.length" :headers="monstersTableHeader('delete')" :items="deck" :mobile-breakpoint="0" dense
        disable-pagination hide-default-footer>
        <!-- カード名 -->
        <template #[`item.name`]="{ item }">
          <a :href="officialUrl(item.id)" target="_blank">
            {{ item.name }}
          </a>
        </template>

        <!-- 効果 -->
        <template #[`item.prop`]="{ item }">
          <span>{{ item.prop.join($i18n.locale == "ja" ? "、" : ", ") }}</span>
        </template>

        <!-- カードテキスト -->
        <template #[`item.text`]="{ item }">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on" small>
                {{ $t("monstersTable.cardText") }}
              </v-btn>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </template>

        <!-- 削除ボタン -->
        <template #[`item.delete`]="{ item }">
          <v-btn @click="
            deleteMonster(item);
          updateUrl();
          " color="primary" small>{{ $t("monstersTable.deleteButton") }}</v-btn>
        </template>
      </v-data-table>

      <v-btn color="primary" class="mt-3" @click="clearMonster">
        {{ $t("deck.clear") }}
      </v-btn>

      <v-btn color="primary" class="mt-3 ml-3" v-clipboard:copy="deckUrl" :disabled="!this.deck.length">
        {{ $t("deck.copyURL") }}
      </v-btn>

      <v-btn color="#34c6eb" class="mt-3 ml-3" :disabled="!this.deck.length" light rounded dark>
        <ShareNetwork network="twitter" :url="deckUrl" :title="'【' + $t('header.appTitle') + '】'"
          :description="$t('deck.tweetDescription')" :hashtags="$t('deck.tweetHashtags')"
          style="text-decoration: none; color: inherit">{{ $t("deck.tweet") }}
        </ShareNetwork>
      </v-btn>
    </div>

    <!--
        中継ぎカード検索
    -->
    <h2 class="header-name text-h6 mt-3">
      {{ $t("relayMonster.title") }}
    </h2>

    <div class="ps-2 pt-2">
      <p>{{ $t("relayMonster.text") }}</p>

      <v-list v-for="card in deck" :key="card.id">
        <v-checkbox v-model="relayCardIds" :label="card.name" :value="card.id" class="ma-0 pa-0" hide-details
          @change="updateRelayCandidates"></v-checkbox>
      </v-list>

      <template v-if="relayCandidates.length">
        <p>{{ $t("relayMonster.text2") }}</p>

        <v-text-field ref="keywordInput" :label="$t('relayMonster.keywordInput.label')"
          :placeholder="$t('relayMonster.keywordInput.placeholder')" append-icon="mdi-magnify" clearable dense
          hide-details outlined persistent-placeholder style="width: 500px" @input="filterRelayCandidates"></v-text-field>

        <v-data-table v-if="filteredRelayCandidates.length" :footer-props="{ 'items-per-page-options': [15, 20, 50, -1] }"
          :headers="monstersTableHeader('add')" :items-per-page="15" :items="filteredRelayCandidates"
          :mobile-breakpoint="0" class="mt-5" dense>
          <!-- カード名 -->
          <template #[`item.name`]="{ item }">
            <a :href="officialUrl(item.id)" target="_blank">
              {{ item.name }}
            </a>
          </template>

          <!-- 効果 -->
          <template #[`item.prop`]="{ item }">
            <span>{{
              item.prop.join($i18n.locale == "ja" ? "、" : ", ")
            }}</span>
          </template>

          <!-- カードテキスト -->
          <template #[`item.text`]="{ item }">
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-btn color="secondary" dark v-bind="attrs" v-on="on" small>
                  {{ $t("monstersTable.cardText") }}
                </v-btn>
              </template>
              <span>{{ item.text }}</span>
            </v-tooltip>
          </template>

          <!-- 追加ボタン -->
          <template #[`item.add`]="{ item }">
            <v-btn @click="
              addMonster(item);
            updateUrl();
            " color="primary" small>{{ $t("monstersTable.addButton") }}</v-btn>
          </template>
        </v-data-table>
      </template>
    </div>

    <!--
        グラフ
    -->
    <h2 class="header-name text-h6 mt-3">{{ $t("graph.title") }}</h2>

    <div class="ps-2 pt-2">
      <p>{{ $t("graph.text") }}</p>

      <div class="d-flex">
        <!-- 辺のラベルを表示するかどうか -->
        <v-checkbox v-model="showEdgeLabel" :label="$t('graph.showVertexCheckbox.label')" @click="updateEdgeLabel"
          hide-details></v-checkbox>

        <!-- カード画像を表示するかどうか -->
        <v-checkbox class="ml-2" v-model="showCardImage" :label="$t('graph.showCardImageCheckbox.label')"
          @click="updateCardImage" hide-details></v-checkbox>
      </div>

      <div id="cy" class="mt-3"></div>

      <v-btn v-if="!isMobile" color="primary" class="mt-3" @click="downloadGraphImage">
        {{ $t("graph.downloadGraphImage") }}
      </v-btn>

      <v-btn color="primary" class="mt-3 ml-3" v-clipboard:copy="deckUrl" :disabled="!this.deck.length">
        {{ $t("deck.copyURL") }}
      </v-btn>

      <v-btn color="#34c6eb" class="mt-3 ml-3" :disabled="!this.deck.length" light rounded dark>
        <ShareNetwork network="twitter" :url="deckUrl" :title="'【' + $t('header.appTitle') + '】'"
          :description="$t('deck.tweetDescription')" :hashtags="$t('deck.tweetHashtags')"
          style="text-decoration: none; color: inherit">{{ $t("deck.tweet") }}
        </ShareNetwork>
      </v-btn>
    </div>

    <!--
        マトリックス (スマホは表示崩れるので非表示)
    -->
    <template v-if="!isMobile">
      <h2 class="header-name text-h6 mt-3">{{ $t("matrixTable.title") }}</h2>

      <div class="ps-2 pt-2">
        <p v-html="$t('matrixTable.text')"></p>

        <div v-html="createMatrix()"></div>
      </div>
    </template>

    <!--
        パターン表
    -->
    <h2 class="header-name text-h6 mt-3">{{ $t("patternTable.title") }}</h2>

    <div class="ps-2 pt-2">
      <p v-html="$t('patternTable.text')"></p>

      <v-simple-table>
        <thead>
          <tr>
            <th>{{ $t("limitPatternsTable.column.name") }}</th>
            <th>{{ $t("limitPatternsTable.column.src") }}</th>
            <th>{{ $t("limitPatternsTable.column.relay") }}</th>
            <th>{{ $t("limitPatternsTable.column.dst") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in deck" :key="card.id">
            <td>{{ card.name }}</td>
            <td>
              <v-checkbox v-model="srcCardNames" :value="card.name" @change="updateGraph" class="ma-0 pa-0"
                hide-details></v-checkbox>
            </td>
            <td>
              <v-checkbox v-model="relayCardNames" :value="card.name" @change="updateGraph" class="ma-0 pa-0"
                hide-details></v-checkbox>
            </td>
            <td>
              <v-checkbox v-model="dstCardNames" :value="card.name" @change="updateGraph" class="ma-0 pa-0"
                hide-details></v-checkbox>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-data-table :headers="patternsTableHeader()" :items="filteredPatterns" :sort-by.sync="patternsSortBy"
        :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [20, 30, 50, -1] }" :items-per-page="30" dense
        class="mt-5 patterns-table">
        <template #[`item.relay`]="{ item }">
          <span v-html="item.relay.join('<br/>')"></span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
import { isMobile } from "mobile-device-detect";
import dagre from "cytoscape-dagre";
import {
  jaIdToMonsterProp,
  jaIdToMonsterRace,
  jaIdToMonsterAttr,
  enIdToMonsterProp,
  enIdToMonsterRace,
  enIdToMonsterAttr,
} from "@/const.js";

cytoscape.use(dagre);

let cy = null;

export default {
  name: "Home",

  components: {},

  watch: {
    "$i18n.locale": function () {
      this.loadCardData();
      this.deckCandidates = [];
      this.relayCandidates = [];
      this.deck = [];
      this.patterns = [];
      this.relayCardIds = [];
      this.srcCardNames = [];
      this.relayCardNames = [];
      this.dstCardNames = [];
      this.filteredRelayCandidates = [];

      this.updateGraph();
      if (this.$refs.keywordInput) {
        // 中継ぎ絞り込み用のテキストボックスは常に存在しているとは限らない
        this.$refs.keywordInput.reset();
      }
      this.$refs.monsterNameInput.reset();
    },
  },

  computed: {
    filteredPatterns: function () {
      // パターン表でサーチ元とサーチ先が同じものは除外するため
      return this.patterns.filter((x) => x.src != x.dst);
    },

    pageUrl() {
      return `https://${window.location.host}${this.appDir}/`;
    },

    deckUrl() {
      if (this.deck.length) {
        const cardIds = this.deck.map((x) => x.id).join(",");
        return `https://${window.location.host}${this.appDir}/?card_id=${cardIds}`;
      } else {
        return `https://${window.location.host}${this.appDir}/`;
      }
    },
  },

  data: () => ({
    monsterIds: [12950, 9455, 11708, 9278, 13587, 9279, 6980, 14741, 12067, 12070, 8933],

    // モンスターの一覧
    monsters: null,
    // 候補の最大数
    maxCandidates: 300,
    // デッキのモンスター一覧
    deck: [],
    // モンスター候補一覧
    deckCandidates: [],
    // 辺のラベルを隠すかどうか
    showEdgeLabel: false,
    // モンスター画像を表示するかどうか
    showCardImage: false,
    patternsSortBy: "dst",
    debugMode: location.hostname === "localhost",
    graphImage: null,
    isMobile: isMobile,
    appDir: "/apps/yugioh-small-world-searcher",

    //
    // 言語が変更されたら初期化する変数
    //
    relayCandidates: [], // 中継ぎ検索
    patterns: [], // パターン一覧
    srcCardNames: [], // サーチ元カードをフィルタする場合
    relayCardNames: [], // 中継ぎカードをフィルタする場合
    dstCardNames: [], // サーチ先カードをフィルタする場合
    relayCardIds: [],
    filteredRelayCandidates: [],

    cyConfig: {
      container: null,
      maxZoom: 2.0,
      //wheelSensitivity: 0.05,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      elements: {
        nodes: [],
        edges: [],
      },
      style: cytoscape.stylesheet().selector("node").style({
        height: 25,
        width: 25,
        shape: "ellipse",
        content: "data(name)",
        "border-color": "black",
        "border-width": 1,
        "text-valign": "bottom",
        "text-halign": "center",
        "text-background-padding": "3px",
        "text-background-color": "white",
        "text-background-opacity": 0.8,
        "text-margin-y": "8px",
      }).selector("edge")
        .style({
          width: 3,
          color: "#b0752e",
          "line-color": "data(color)",
          "text-background-padding": "3px",
          "text-background-color": "white",
          "text-background-opacity": 0.8,
        }),
      layout: {
        name: "dagre",
        nodeDimensionsIncludeLabels: true,
      },
    },
  }),

  mounted: function () {
    this.cyConfig.container = document.getElementById("cy");
    this.loadCardData();
  },

  methods: {
    // カード候補を更新する。
    updateMonsterCandidates(keyword) {
      if (!this.monsters) {
        return false; // カード情報が存在しない場合
      }

      this.deckCandidates = [];

      if (!keyword) {
        return;
      }

      const sanitizedKeywords = keyword
        .split(" ")
        .map((x) => this.sanitizeWord(x))
        .filter(Boolean);

      for (const monster of this.monsters) {
        if (this.isMonsterMatched(monster, sanitizedKeywords)) {
          this.deckCandidates.push(monster);
        }

        if (this.deckCandidates.length >= this.maxCandidates) {
          break; // 候補数の上限に達した場合
        }
      }
    },

    // 中継ぎカード候補を更新する。
    updateRelayCandidates() {
      this.search = "";
      this.relayCandidates = [];

      if (this.relayCardIds.length < 2) {
        return; // 最低2つのモンスターが必要
      }

      const targetCards = this.monsters.filter((x) =>
        this.relayCardIds.includes(x.id)
      );

      for (const card of this.monsters) {
        if (targetCards.every((x) => this.isConnected(card, x))) {
          this.relayCandidates.push(card);
        }
      }

      this.filteredRelayCandidates = this.relayCandidates;
    },

    filterRelayCandidates(keyword) {
      if (!keyword) {
        return;
      }

      // 種族、属性、性質は完全一致で確認するため、
      // サニタイズされていないワードも保持しておく。
      let sanitizedKeywords = keyword
        .split(" ")
        .map((x) => [x, this.sanitizeWord(x)])
        .filter((x) => x[0] && x[1]);

      this.filteredRelayCandidates = [];
      for (const card of this.relayCandidates) {
        if (this.isRelayMonsterMatched(card, sanitizedKeywords)) {
          this.filteredRelayCandidates.push(card);
        }
      }
    },

    monstersTableHeader(btnType) {
      return [
        // { text: "CardId", value: "id" },
        { text: this.$t("monstersTable.column.name"), value: "name" },
        { text: "", value: btnType },
        { text: this.$t("monstersTable.column.race"), value: "race" },
        { text: this.$t("monstersTable.column.attr"), value: "attr" },
        { text: this.$t("monstersTable.column.level"), value: "level" },
        { text: this.$t("monstersTable.column.atk"), value: "atk" },
        { text: this.$t("monstersTable.column.def"), value: "def" },
        { text: this.$t("monstersTable.column.prop"), value: "prop" },
        {
          text: this.$t("monstersTable.column.text"),
          value: "text",
          sortable: false,
        },
      ];
    },

    patternsTableHeader() {
      return [
        {
          text: this.$t("patternsTable.column.src"),
          value: "src",
        },
        {
          text: this.$t("patternsTable.column.relay"),
          value: "relay",
          sortable: false,
        },
        {
          text: this.$t("patternsTable.column.dst"),
          value: "dst",
        },
      ];
    },

    // カードデータを読み込む。
    loadCardData() {
      const filePath = `${this.appDir}/${this.$i18n.locale}_monsters_20240213.json`;
      this.axios.get(filePath).then((res) => {
        this.monsters = res.data;

        // 検索高速化のために、カード名、ルビをサニタイズしておく。
        for (let monster of this.monsters) {
          monster.sanitizedName = this.sanitizeWord(monster.name);
          // TCG 限定カードはルビがない
          monster.sanitizedRuby = monster.ruby
            ? this.sanitizeWord(monster.ruby)
            : "";

          // ID を値に変換する。
          if (this.$i18n.locale == "ja") {
            monster.prop = monster.prop.map((x) => jaIdToMonsterProp[x]);
            monster.race = jaIdToMonsterRace[monster.race];
            monster.attr = jaIdToMonsterAttr[monster.attr];
          } else {
            monster.prop = monster.prop.map((x) => enIdToMonsterProp[x]);
            monster.race = enIdToMonsterRace[monster.race];
            monster.attr = enIdToMonsterAttr[monster.attr];
          }
        }

        // クエリのカード ID を取得する。
        let cardIds = [];
        if (this.$route.query.card_id) {
          const tokens = this.$route.query.card_id.split(",");
          for (const token of tokens) {
            cardIds.push(Number(token));
          }

          for (const monster of this.monsters) {
            if (cardIds.includes(monster.id)) {
              this.addMonster(monster);
            }
          }
        }
      });
    },

    // 遊戯王カードデータベースの URL を返す。
    officialUrl(card_id) {
      return `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${card_id}&request_locale=${this.$i18n.locale}`;
    },

    // キーワードをサニタイズする。
    sanitizeWord(s) {
      // 全角英数字は半角英数字に変換する。
      s = s.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
      });

      // カタカナはひらがなに変換する。
      s = s.replace(/[\u30a1-\u30f6]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) - 0x0060);
      });

      // 半角大文字英数字は小文字にする。
      s = s.toLowerCase();

      // 以下で定義する文字以外を削除する。
      // 漢字: \u4E00-\u9FFF
      // ひらがな: \u3041-\u3096
      // ギリシャ文字: \u0391-\u03A9\u03B1-\u03C9
      // ローマ数字: \u2160-\u216C
      // ー: \u30fc
      s = s.replace(
        /[^\w\d\u3041-\u3096\u4E00-\u9FFF\u0391-\u03A9\u03B1-\u03C9\u2160-\u216C\u30fc]/gi,
        ""
      );

      return s;
    },

    // マッチするかどうかを判定する。
    isMonsterMatched(card, keywords) {
      if (!keywords.length) {
        return false; // 空の配列の場合
      }

      return keywords.every(
        (x) => card.sanitizedName.includes(x) || card.sanitizedRuby.includes(x)
      );
    },

    isRelayMonsterMatched(card, keywords) {
      let numMatches = 0;
      for (const [keyword, sanitizeKeyword] of keywords) {
        numMatches +=
          card.sanitizedName.includes(sanitizeKeyword) ||
          card.sanitizedRuby.includes(sanitizeKeyword);
        // 湯族、属性、性質は完全一致で確認する。
        numMatches += card.race.includes(keyword);
        numMatches += card.attr.includes(keyword);
        numMatches += card.prop.includes(keyword);
      }

      // AND 検索
      return numMatches >= keywords.length;
    },

    addMonster(monster) {
      const found = this.deck.find((x) => {
        return x.name === monster.name;
      });

      if (found) {
        return;
      }

      this.deck.push(monster);
      this.srcCardNames = this.deck.map((x) => x.name);
      this.relayCardNames = this.deck.map((x) => x.name);
      this.dstCardNames = this.deck.map((x) => x.name);

      this.updateGraph();
    },

    addMonsterById(monsterId) {
      if (!this.monsters) {
        return;
      }

      let monster = this.monsters.find((x) => {
        return x.id === monsterId;
      });
      if (!monster) {
        return;
      }

      const found = this.deck.find((x) => {
        return x.id === monster.id;
      });

      if (found) {
        return;
      }

      this.deck.push(monster);
      this.srcCardNames = this.deck.map((x) => x.name);
      this.relayCardNames = this.deck.map((x) => x.name);
      this.dstCardNames = this.deck.map((x) => x.name);

      this.updateGraph();
    },

    getMonsterName(monsterId) {
      if (!this.monsters) {
        return;
      }

      let monster = this.monsters.find((x) => {
        return x.id === monsterId;
      });
      if (!monster) {
        return;
      }


      return monster.name
    },

    deleteMonster(monster) {
      this.deck = this.deck.filter((x) => {
        return x.name !== monster.name;
      });

      this.srcCardNames = this.deck.map((x) => x.name);
      this.relayCardNames = this.deck.map((x) => x.name);
      this.dstCardNames = this.deck.map((x) => x.name);

      this.updateGraph();
    },

    clearMonster(monster) {
      this.deck = [];
      this.srcCardNames = [];
      this.relayCardNames = [];
      this.dstCardNames = [];

      this.updateGraph();
      this.updateUrl();
    },

    updateUrl() {
      const cardIds = this.deck.map((x) => x.id).join(",");
      if (this.deck.length) {
        this.$router
          .push({
            path: this.$route.path,
            query: { card_id: cardIds },
          })
          .catch(() => { });
      } else {
        this.$router
          .push({
            path: this.$route.path,
          })
          .catch(() => { });
      }
    },

    isConnected(a, b) {
      let same = 0;
      let info;
      for (const key of ["race", "attr", "level", "atk", "def"]) {
        if (a[key] == b[key]) {
          same += 1;
          if (key == "level") {
            info = {
              label: `${this.$t("graph.edgeLabel.level")}${a[key]}`,
              color: "#2596be",
            };
          } else if (key == "atk") {
            info = {
              label: `${this.$t("graph.edgeLabel.attack")}${a[key]}`,
              color: "#FA7070",
            };
          } else if (key == "def") {
            info = {
              label: `${this.$t("graph.edgeLabel.defence")}${a[key]}`,
              color: "darkgreen",
            };
          } else if (key == "attr") {
            info = {
              label: a[key],
              color: "#FD841F",
            };
          } else {
            info = {
              label: a[key],
              color: "#ADDDD0",
            };
          }
        }
      }

      if (same == 1) {
        // 共通点が1つだけの場合
        return info;
      }

      return false;
    },

    updateGraph() {
      // ノードを追加する。
      let nodes = [];
      for (const card of this.deck) {
        nodes.push({ data: { id: card.id, name: card.name, "image": `${this.appDir}/images/${card.id}.jpg` } });
      }

      // ペアの組み合わせを作成する。
      const pairs = this.deck.flatMap((v, i) =>
        this.deck.slice(i + 1).map((w) => [v, w])
      );

      // 辺を追加する。
      let edges = [];
      for (const pair of pairs) {
        const a = pair[0];
        const b = pair[1];
        const info = this.isConnected(a, b);
        if (info) {
          edges.push({
            data: {
              id: `${a.id}_${b.id}`,
              source: a.id,
              target: b.id,
              label: info.label,
              color: info.color,
            },
          });
        }
      }

      // cytoscape オブジェクトを作成する。
      this.cyConfig.elements.nodes = nodes;
      this.cyConfig.elements.edges = edges;
      cy = cytoscape(this.cyConfig);

      this.createPatternTable(cy);
    },

    updateEdgeLabel() {
      if (!this.showEdgeLabel) {
        this.cyConfig.style.selector("edge").style({
          content: "",
        });
      } else {
        this.cyConfig.style.selector("edge").style({
          content: "data(label)",
        });
      }

      this.updateGraph();
    },

    updateCardImage() {
      if (this.showCardImage) {
        this.cyConfig.style.selector("node").style({
          height: 80,
          width: 80,
          shape: "ellipse",
          "font-size": "20px",
          "background-image": "data(image)",
          "background-fit": "contain"
        })
      }
      else {
        this.cyConfig.style.selector("node").style({
          height: 25,
          width: 25,
          shape: "ellipse",
          content: "data(name)",
          "font-size": "15px",
          "background-image": "404.jpg",
          "background-fit": "contain",
        });
      }

      this.updateGraph();
    },

    createPatternTable(cy) {
      let table = [];
      for (let firstNode of cy.nodes()) {
        let secondNodes = firstNode
          .neighborhood()
          .filter((x) => x.data("name") != undefined);

        for (let secondNode of secondNodes) {
          let thirdNodes = secondNode
            .neighborhood()
            .filter((x) => x.data("name") != undefined);

          for (let thirdNode of thirdNodes) {
            // if (firstNode.data("name") == thirdNode.data("name")) {
            //   continue; // サーチ元とサーチ先が同じ
            // }
            if (!this.srcCardNames.includes(firstNode.data("name"))) {
              continue; // サーチ元を限定する
            }
            if (!this.relayCardNames.includes(secondNode.data("name"))) {
              continue; // 中継ぎを限定する
            }
            if (!this.dstCardNames.includes(thirdNode.data("name"))) {
              continue; // サーチ先を限定する
            }

            const key = [firstNode.data("name"), thirdNode.data("name")].join(
              "、"
            );

            if (!Object.prototype.hasOwnProperty.call(table, key)) {
              table[key] = [];
            }
            table[key].push({
              id: secondNode.data("id"),
              name: secondNode.data("name"),
            });
          }
        }
      }

      // テーブルを作成する。
      this.patterns = [];
      for (const [srcAnddstName, relays] of Object.entries(table)) {
        const [srcName, dstName] = srcAnddstName.split("、");
        const relayNames = relays
          .sort((a, b) => a.id - b.id)
          .map((x) => x.name);

        this.patterns.push({
          src: srcName,
          relay: relayNames,
          dst: dstName,
        });
      }
    },

    downloadGraphImage() {
      if (!cy) {
        return; // 画像が生成されていない場合
      }

      this.graphImage = cy.png({ bg: "#ffffff" });

      var a = document.createElement("a");
      a.href = this.graphImage;
      a.download = "Small-World.png";
      a.click();
    },

    createMatrix() {
      if (!this.patterns || !this.patterns.length) {
        return;
      }

      let html = "";
      // 1行目: サーチ先
      html += '<table class="matrix">';
      html += `<tr><th colspan="2" rowspan="2"></th>`;
      html += `<th colspan="${this.deck.length}">${this.$t(
        "matrixTable.dstHeader"
      )}</th></tr>`;

      // 2行目: サーチ先モンスター名
      html += "<tr>";
      this.deck.forEach((card) => {
        html += `<th><span class="vertical-text">${card.name}</span></th>`;
      });
      html += "</tr>";

      // 3行目~: サーチ元モンスター名
      this.deck.forEach((srcCard, i) => {
        html += "<tr>";

        if (i === 0) {
          html += `<th rowspan="${this.deck.length
            }"><span class="vertical-text">${this.$t(
              "matrixTable.srcHeader"
            )}</span></th>`;
        }

        html += `<th>${this.deck[i].name}</th>`;
        this.deck.forEach((dstCard) => {
          const pattern = this.patterns.find(
            (x) => x.src == srcCard.name && x.dst == dstCard.name
          );
          if (pattern) {
            html += `<td style="color: green"><div class="tooltip1"><p>○</p><div class="description1">${this.$t(
              "matrixTable.relayHeader"
            )}<br/>${pattern.relay.join("<br/>")}</div></div></td>`;
          } else {
            html += `<td></td>`;
          }
        });

        html += "</tr>";
      });

      html += "</table>";

      return html;
    },
  },
};
</script>

<style>
#cy {
  border: thin solid black;
  width: 100%;
  height: 600px;
}

.header-name {
  padding: 10px;
  border-left: 5px solid #000000;
  background: #f4f4f4;
}

.v-tooltip__content {
  opacity: 1 !important;
  width: 500px !important;
}

.patterns-table th,
.patterns-table td {
  border-bottom: 1px solid #000000 !important;
}

.patterns-table td {
  padding: 6px !important;
}

.matrix {
  border-collapse: collapse;
}

.matrix th,
.matrix td {
  border: thin solid black;
  text-align: center;
}

.vertical-text {
  writing-mode: vertical-rl;
  white-space: pre;
  display: inline-block;
}

.tooltip1 {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.tooltip1 p {
  margin: 0;
  padding: 0;
}

.description1 {
  display: none;
  position: absolute;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
  line-height: 1.5em;
  color: #fff;
  background: #000;
  width: 400px;
}

.description1:before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -15px;
}

.tooltip1:hover .description1 {
  display: inline-block;
  top: 0px;
  left: 30px;
}
</style>
