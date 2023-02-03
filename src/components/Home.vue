<template>
  <div class="pa-3">
    <!-- 
        概要
    -->
    <h2 class="header-name text-h6">{{ $t("overview.title") }}</h2>

    <div class="ps-2 pt-2">
      <p class="ma-0" v-html="$t('overview.text')"></p>
      <p class="ma-0" v-html="$t('overview.text2')"></p>
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
      <p>{{ $t("addMonster.text") }}</p>

      <!-- カード名入力欄 -->
      <v-text-field
        ref="monstersTable"
        :label="$t('addMonster.monsterNameInput.label')"
        :placeholder="$t('addMonster.monsterNameInput.placeholder')"
        clearable
        dense
        hide-details
        outlined
        persistent-placeholder
        style="width: 500px"
        @input="updateMonsterCandidates"
        append-icon="mdi-magnify"
      >
      </v-text-field>

      <!-- カード一覧 -->
      <v-data-table
        v-if="deckCandidates.length"
        :footer-props="{ 'items-per-page-options': [15, 20, 50, -1] }"
        :headers="monstersTableHeader('add')"
        :items-per-page="15"
        :items="deckCandidates"
        :mobile-breakpoint="0"
        class="mt-5"
        dense
      >
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
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                {{ $t("monstersTable.cardText") }}
              </v-btn>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </template>

        <!-- 追加ボタン -->
        <template #[`item.add`]="{ item }">
          <v-btn @click="addMonster(item)" color="primary">{{
            $t("monstersTable.addButton")
          }}</v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- 
        デッキ
    -->
    <h2 class="header-name text-h6 mt-3">{{ $t("deck.title") }}</h2>

    <!-- カード一覧 -->
    <div class="ps-2 pt-2">
      <v-data-table
        v-if="deck.length"
        :headers="monstersTableHeader('delete')"
        :items="deck"
        :mobile-breakpoint="0"
        dense
        disable-pagination
        hide-default-footer
      >
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
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                {{ $t("monstersTable.cardText") }}
              </v-btn>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </template>

        <!-- 削除ボタン -->
        <template #[`item.delete`]="{ item }">
          <v-btn @click="deleteMonster(item)" color="primary">{{
            $t("monstersTable.deleteButton")
          }}</v-btn>
        </template>
      </v-data-table>

      <p v-if="!deck.length">{{ $t("deck.text") }}</p>
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
        <v-checkbox
          v-model="relayCardIds"
          :label="card.name"
          :value="card.id"
          class="ma-0 pa-0"
          hide-details
          @change="updateRelayCandidates"
        ></v-checkbox>
      </v-list>

      <template v-if="relayCandidates.length">
        <p>{{ $t("relayMonster.text2") }}</p>

        <v-text-field
          ref="relayTable"
          v-model="search"
          :label="$t('relayMonster.keywordInput.label')"
          :placeholder="$t('relayMonster.keywordInput.placeholder')"
          append-icon="mdi-magnify"
          clearable
          dense
          hide-details
          outlined
          persistent-placeholder
          style="width: 500px"
        ></v-text-field>

        <v-data-table
          v-if="relayCandidates.length"
          :custom-filter="relayCardFilter"
          :footer-props="{ 'items-per-page-options': [15, 20, 50, -1] }"
          :headers="monstersTableHeader('add')"
          :items-per-page="15"
          :items="relayCandidates"
          :mobile-breakpoint="0"
          :search="search"
          class="mt-5"
          dense
        >
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
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                  {{ $t("monstersTable.cardText") }}
                </v-btn>
              </template>
              <span>{{ item.text }}</span>
            </v-tooltip>
          </template>

          <!-- 追加ボタン -->
          <template #[`item.add`]="{ item }">
            <v-btn @click="addMonster(item)" color="primary">{{
              $t("monstersTable.addButton")
            }}</v-btn>
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

      <!-- 辺のラベルを表示するかどうか -->
      <v-checkbox
        v-model="showEdgeLabel"
        :label="$t('graph.showVertexCheckbox.label')"
        @click="updateEdgeLabel"
      ></v-checkbox>

      <div id="cy"></div>
    </div>

    <!-- 
        パターン表
    -->
    <h2 class="header-name text-h6 mt-3">{{ $t("patternTable.title") }}</h2>

    <div class="ps-2 pt-2">
      <p>{{ $t("patternTable.text") }}</p>

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
              <v-checkbox
                v-model="srcCardNames"
                :value="card.name"
                @change="updateGraph"
                class="ma-0 pa-0"
                hide-details
              ></v-checkbox>
            </td>
            <td>
              <v-checkbox
                v-model="relayCardNames"
                :value="card.name"
                @change="updateGraph"
                class="ma-0 pa-0"
                hide-details
              ></v-checkbox>
            </td>
            <td>
              <v-checkbox
                v-model="dstCardNames"
                :value="card.name"
                @change="updateGraph"
                class="ma-0 pa-0"
                hide-details
              ></v-checkbox>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-data-table
        :headers="patternsTableHeader()"
        :items="patterns"
        :sort-by.sync="patternsSortBy"
        disable-pagination
        hide-default-footer
        dense
        class="mt-5 patterns-table"
      >
        <template #[`item.relay`]="{ item }">
          <span v-html="item.relay.join('<br/>')"></span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
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

export default {
  name: "Home",

  components: {},

  watch: {
    "$i18n.locale": function () {
      this.loadCardData();
      this.deckCandidates = [];
      this.relayCandidates = [];
      this.deck = [];
      this.updateGraph();
      this.$refs.monstersTable.reset();
    },
  },

  data: () => ({
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
    // 中継ぎ検索
    relayCandidates: [],
    search: "",
    // パターン一覧
    patterns: [],
    patternsSortBy: "dst",
    srcCardNames: [], // サーチ元カードをフィルタする場合
    relayCardNames: [], // 中継ぎカードをフィルタする場合
    dstCardNames: [], // サーチ先カードをフィルタする場合
    relayCardIds: [],
    debugMode: location.hostname == "localhost",

    cy: {
      container: null,
      maxZoom: 1,
      style: cytoscape
        .stylesheet()
        .selector("node")
        .style({
          height: 30,
          width: 30,
          shape: "ellipse",
          content: "data(name)",
          "border-color": "black",
          "border-width": 1,
          "border-opacity": 0.5,
          "text-valign": "bottom",
          "text-halign": "center",
        })
        .selector("edge")
        .style({
          width: 3,
          "line-color": "data(color)",
        }),
      elements: {
        nodes: [],
        edges: [],
      },
      layout: {
        name: "dagre",
        nodeDimensionsIncludeLabels: true,
      },
    },
  }),

  mounted: function () {
    this.cy.container = document.getElementById("cy");
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
      console.log(location.hostname);
      const prefix =
        location.hostname === "localhost"
          ? "/"
          : "/apps/yugioh-small-world-searcher/";

      const filePath = `${prefix}${this.$i18n.locale}_monsters.json`;
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

        // デバッグ用
        if (this.debugMode) {
          for (const monster of this.monsters) {
            if (
              [16498, 16499, 16500, 16501, 16502, 16503, 4013].includes(
                monster.id
              )
            ) {
              this.addMonster(monster);
            }
          }
        }
      });
    },

    // 遊戯王カードデータベースの URL を返す。
    officialUrl(card_id) {
      const lang = this.$i18n.locale == "ja" ? "jp" : "en";
      return `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${card_id}&request_locale=${lang}`;
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
      s = s.replace(
        /[^\w\d\u3041-\u3096\u4E00-\u9FFF\u0391-\u03A9\u03B1-\u03C9\u2160-\u216C]/gi,
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

    relayCardFilter(value, search, items) {
      if (!value == null || typeof value == "number") {
        return false; // 高速化のため、null や数値の場合、判定しない
      }

      const sanitizedKeywords = search
        .split(" ")
        .map((x) => [this.sanitizeWord(x), x])
        .filter(Boolean);

      let numMatches = 0;
      for (const [sanitizedKeyword, keyword] of sanitizedKeywords) {
        numMatches += items.sanitizedName.includes(sanitizedKeyword);
        numMatches += items.sanitizedRuby.includes(sanitizedKeyword);
        numMatches += items.race.includes(keyword);
        numMatches += items.attr.includes(keyword);
        numMatches += items.prop.includes(keyword);
      }

      // AND 検索
      return numMatches >= sanitizedKeywords.length;
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

    deleteMonster(monster) {
      this.deck = this.deck.filter((x) => {
        return x.name !== monster.name;
      });

      this.srcCardNames = this.deck.map((x) => x.name);
      this.relayCardNames = this.deck.map((x) => x.name);
      this.dstCardNames = this.deck.map((x) => x.name);

      this.updateGraph();
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
        nodes.push({ data: card });
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
      this.cy.elements.nodes = nodes;
      this.cy.elements.edges = edges;
      let cy = cytoscape(this.cy);
      cy.userZoomingEnabled(false);

      this.createPatternTable(cy);
    },

    updateEdgeLabel() {
      if (!this.showEdgeLabel) {
        this.cy.style.selector("edge").style({
          content: "",
        });
      } else {
        this.cy.style.selector("edge").style({
          content: "data(label)",
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
            if (firstNode.data("name") == thirdNode.data("name")) {
              continue; // サーチ元とサーチ先が同じ
            }
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
        const [srcNames, dstNames] = srcAnddstName.split("、");
        const relayNames = relays
          .sort((a, b) => a.id - b.id)
          .map((x) => x.name);

        this.patterns.push({
          src: srcNames,
          relay: relayNames,
          dst: dstNames,
        });
      }
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
</style>
