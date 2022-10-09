<template>
  <div>
    <!-- 使い方 -->
    <h2 class="header-name">使い方</h2>

    <div>
      <p class="ma-2">
        「デッキ入力」のセレクトボックスからモンスターカードを選択し、
        「追加」ボタンをクリックすることでカードが追加されます。<br />
        カードを追加していくと、「スモールワールドの結果」にスモールワールドで検索できるカードを可視化したグラフ及び早見表が表示されます。
      </p>
    </div>

    <!-- デッキ入力 -->
    <h2 class="header-name">
      {{ lang == "JP" ? "モンスターを追加" : "Add Monaster" }}
    </h2>
    {{ test }}
    <v-container fluid>
      <!-- キーワード入力 -->
      <v-row>
        <v-col cols="auto">
          {{
            lang == "JP"
              ? "カード名の一部を入力すると、候補が出てくるので追加してください。"
              : "Type part of the card name in English."
          }}
          <v-text-field
            v-model="keyword"
            label="カード検索"
            style="width: 500px"
            clearable
            hide-details
            outlined
            dense
            @input="updateCandidates"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- 候補一覧 -->
      <v-row>
        <v-col cols="auto">
          <v-data-table
            v-if="candidates.length"
            :headers="tableHeader('add')"
            :items="candidates"
            hide-default-footer
            disable-pagination
            dense
          >
            <template #[`item.name`]="{ item }">
              <a
                :href="`https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${item.id}&request_locale=${lang}`"
                target="_blank"
              >
                {{ item.name }}
              </a>
            </template>

            <template #[`item.text`]="{ item }">
              <v-tooltip left max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                    テキスト
                  </v-btn>
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </template>

            <template #[`item.add`]="{ item }">
              <v-btn @click="addMonster(item)" color="primary">{{
                lang == "JP" ? "追加" : "Add"
              }}</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <!-- デッキ入力 -->
    <h2 class="header-name">
      {{ lang == "JP" ? "デッキ" : "Deck" }}
    </h2>

    <v-container fluid>
      <v-row>
        <v-col>
          <v-data-table
            :headers="tableHeader('delete')"
            :items="deck"
            hide-default-footer
            disable-pagination
            disable-sort
          >
            <template #[`item.delete`]="{ item }">
              <v-btn @click="deleteMonster(item)" color="primary">{{
                lang == "JP" ? "削除" : "Delete"
              }}</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <!-- 中継ぎカード検索 -->
    <h2 class="header-name">
      {{ lang == "JP" ? "中継ぎカード検索" : "Relay Card Search" }}
    </h2>
    <v-container fluid>
      <v-row>
        <v-col cols="auto">
          チェックボックスで選択したカードを相互に行き来可能にする中継ぎカードを検索、追加できます。
          <v-list v-for="card in deck" :key="card.id">
            <v-checkbox
              v-model="relayCardIds"
              :label="card.name"
              :value="card.id"
              @change="updateRelayCandidates"
              class="ma-0 pa-0"
              hide-details
            ></v-checkbox>
          </v-list>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="auto">
          <template v-if="relayCandidates.length">
            キーワードを入力すると、絞り込めます。空白区切りで複数のキーワードを指定できます。「例:
            ドラゴン族」「例: チューナー 水属性 魔法使い族」
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="検索入力欄"
              outlined
              dense
              hide-details
            ></v-text-field>

            <v-data-table
              v-if="relayCandidates.length"
              :headers="realyCadidatesHeaders()"
              :items="relayCandidates"
              :items-per-page="15"
              dense
              :search="search"
              :customFilter="customFilter"
            >
              <template #[`item.name`]="{ item }">
                <a
                  :href="`https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${item.id}&request_locale=${lang}`"
                  target="_blank"
                >
                  {{ item.name }}
                </a>
              </template>

              <template #[`item.text`]="{ item }">
                <v-tooltip left max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                      テキスト
                    </v-btn>
                  </template>
                  <span>{{ item.text }}</span>
                </v-tooltip>
              </template>

              <template #[`item.add`]="{ item }">
                <v-btn @click="addMonster(item)" color="primary">{{
                  lang == "JP" ? "追加" : "Add"
                }}</v-btn>
              </template>
            </v-data-table>
          </template>
        </v-col>
      </v-row>
    </v-container>

    <!-- デッキ入力 -->
    <h2 class="header-name">{{ lang == "JP" ? "グラフ" : "Graph" }}</h2>
    点の位置は、点を選択して、マウスでドラッグすると動かせます。見づらい場合は調整してください。
    <v-checkbox
      v-model="hideEdgeLabel"
      :label="lang == 'JP' ? '辺のラベルを表示する' : 'Show edge label'"
      @click="updateEdgeLabel"
    ></v-checkbox>
    <div id="cy"></div>

    <h2 class="header-name">{{ lang == "JP" ? "早見表" : "CheatSheet" }}</h2>

    <v-container>
      <v-row>
        <v-col>
          サーチ元を限定する
          <v-list v-for="card in deck" :key="card.id">
            <v-checkbox
              v-model="filteredfirstNames"
              :label="card.name"
              :value="card.name"
              @change="updateGraph"
              class="ma-0 pa-0"
              hide-details
            ></v-checkbox>
          </v-list>
        </v-col>
        <v-col>
          サーチ先を限定する
          <v-list v-for="card in deck" :key="card.id">
            <v-checkbox
              v-model="filteredthirdNames"
              :label="card.name"
              :value="card.name"
              @change="updateGraph"
              class="ma-0 pa-0"
              hide-details
            ></v-checkbox>
          </v-list>
        </v-col>
      </v-row>
    </v-container>

    <v-data-table
      :sort-by.sync="searchTableSortBy"
      :headers="searchTableHeader"
      :items="searchTable"
      hide-default-footer
      disable-pagination
    >
    </v-data-table>
  </div>
</template>

<script>
import monsters_origin from "../assets/monsters.json";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

export default {
  name: "Home",
  components: {},

  watch: {
    lang: function (newVal, oldVal) {
      this.candidates = [];
      this.deck = [];
      this.keyword = "";
      this.monsters = JSON.parse(JSON.stringify(monsters_origin));

      if (newVal == "EN") {
        for (let monster of this.monsters) {
          if (monster.name_en) {
            monster.name = monster.name_en;
          }
        }
      }

      this.updateGraph();
    },
  },

  computed: {
    searchTableHeader() {
      if (this.lang == "JP") {
        return [
          { text: "サーチ元", value: "first" },
          { text: "中継", value: "second" },
          { text: "サーチ先", value: "third" },
        ];
      } else {
        return [
          { text: "Source", value: "first" },
          { text: "Relay", value: "second" },
          { text: "Dest", value: "third" },
        ];
      }
    },
  },

  props: ["lang"],

  data: () => ({
    test: null,
    deck: [],
    hideEdgeLabel: false,
    searchTable: [],
    searchTableSortBy: "third",
    filteredfirstNames: [], // サーチ元をフィルタする場合
    filteredthirdNames: [], // サーチ先をフィルタする場合
    relayCardIds: [],
    relayCandidates: [],
    monsters: monsters_origin,
    candidates: [],
    keyword: "",
    search: "",

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

    // for (let monster of monsters_origin) {
    //   if (
    //     ["16498", "16499", "16500", "16501", "16502", "16503"].includes(
    //       monster.id
    //     )
    //   ) {
    //     this.addMonster(monster);
    //   }
    // }
  },

  methods: {
    updateRelayCandidates() {
      this.relayCandidates = [];

      if (this.relayCardIds.length < 2) {
        return;
      }

      let targetCards = this.monsters.filter((x) =>
        this.relayCardIds.includes(x.id)
      );

      for (let card of this.monsters) {
        if (targetCards.every((x) => this.isConnected(card, x))) {
          this.relayCandidates.push(card);
        }
      }
    },

    customFilter(value, search, items) {
      if (value == undefined || typeof value == "number") {
        return false;
      }

      let numMatches = 0;
      for (let token of search.split(" ")) {
        numMatches += items.name.includes(token);
        numMatches += items.race.includes(token);
        numMatches += items.attr.includes(token);
        numMatches += items.detail.includes(token);
      }
      return numMatches >= search.split(" ").length;
    },

    realyCadidatesHeaders() {
      let headers = [];

      if (this.lang == "JP") {
        headers = [
          { text: "名前", value: "name" },
          { text: "種族", value: "race" },
          { text: "属性", value: "attr" },
          { text: "レベル", value: "level" },
          { text: "攻撃力", value: "attack" },
          { text: "防御力", value: "defence" },
          { text: "種類", value: "detail" },
          { text: "テキスト", value: "text" },
          { text: "", value: "add" },
        ];
      } else {
        headers = [
          { text: "Name", value: "name" },
          { text: "Race", value: "race" },
          { text: "Attribute", value: "attr" },
          { text: "Level", value: "level" },
          { text: "Attack", value: "attack" },
          { text: "Defence", value: "defence" },
          { text: "Detail", value: "detail" },
          { text: "", value: "add" },
        ];
      }

      return headers;
    },

    tableHeader(btnType) {
      let headers = [];

      if (this.lang == "JP") {
        headers = [
          { text: "名前", value: "name" },
          { text: "種族", value: "race" },
          { text: "属性", value: "attr" },
          { text: "レベル", value: "level" },
          { text: "攻撃力", value: "attack" },
          { text: "防御力", value: "defence" },
        ];
      } else {
        headers = [
          { text: "Name", value: "name" },
          { text: "Race", value: "race" },
          { text: "Attribute", value: "attr" },
          { text: "Level", value: "level" },
          { text: "Attack", value: "attack" },
          { text: "Defence", value: "defence" },
        ];
      }

      if (btnType == "add") {
        headers.push({ text: "", value: "add" });
      } else {
        headers.push({ text: "", value: "delete" });
      }

      return headers;
    },

    updateCandidates() {
      this.candidates = [];

      if (!this.keyword || this.keyword.trim() == "") {
        return;
      }

      for (let monster of this.monsters) {
        if (this.lang == "JP" && this.matchCardJP(monster, this.keyword)) {
          this.candidates.push(monster);
        } else if (
          this.lang == "EN" &&
          this.matchCardEN(monster, this.keyword)
        ) {
          this.candidates.push(monster);
        }

        if (this.candidates.length > 10) break;
      }
    },

    kanaToHira(str) {
      return str.replace(/[\u30a1-\u30f6]/g, function (match) {
        let chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
      });
    },

    matchCardJP(card, keyword) {
      for (let word of keyword.split()) {
        if (card.name.includes(word)) {
          return true;
        }

        if (card.ruby.includes(word)) {
          return true;
        }

        if (this.kanaToHira(card.ruby).includes(word)) {
          return true;
        }
      }

      return false;
    },

    matchCardEN(card, keyword) {
      for (let word of keyword.split()) {
        if (card.name.toLowerCase().includes(word.toLowerCase())) {
          return true;
        }
      }

      return false;
    },

    addMonster(monster) {
      let found = this.deck.find((x) => {
        return x.name === monster.name;
      });
      if (found) return;

      this.deck.push(monster);
      this.filteredfirstNames = this.deck.map((x) => x.name);
      this.filteredthirdNames = this.deck.map((x) => x.name);

      this.updateGraph();
    },

    deleteMonster(monster) {
      this.deck = this.deck.filter((x) => {
        return x.name !== monster.name;
      });
      this.filteredfirstNames = this.deck.map((x) => x.name);
      this.filteredthirdNames = this.deck.map((x) => x.name);

      this.updateGraph();
    },

    isConnected(a, b) {
      let same = 0;
      let info;
      for (let key of ["race", "attr", "level", "attack", "defence"]) {
        if (a[key] == b[key]) {
          same += 1;
          if (key == "level") {
            info = {
              label: `レベル${a[key]}`,
              color: "#2596be",
            };
          } else if (key == "attack") {
            info = {
              label: `攻撃力${a[key]}`,
              color: "#FA7070",
            };
          } else if (key == "defence") {
            info = {
              label: `防御力${a[key]}`,
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

      if (same == 1) return info;

      return false;
    },

    updateGraph() {
      // ノードを追加する。
      let nodes = [];
      for (let card of this.deck) {
        nodes.push({ data: card });
      }

      // ペアの組み合わせを作成する。
      let pairs = this.deck.flatMap((v, i) =>
        this.deck.slice(i + 1).map((w) => [v, w])
      );

      // 辺を追加する。
      let edges = [];
      for (let pair of pairs) {
        let a = pair[0];
        let b = pair[1];
        let info = this.isConnected(a, b);
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

      this.cy.elements.nodes = nodes;
      this.cy.elements.edges = edges;
      let cy = cytoscape(this.cy);
      cy.userZoomingEnabled(false);

      this.createTable(cy);
    },

    updateEdgeLabel() {
      if (!this.hideEdgeLabel) {
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

    createTable(cy) {
      let table = [];

      for (let first_node of cy.nodes()) {
        let seconds_nodes = first_node
          .neighborhood()
          .filter((x) => x.data("name") != undefined);

        for (let second_node of seconds_nodes) {
          let third_nodes = second_node
            .neighborhood()
            .filter((x) => x.data("name") != undefined);

          for (let third_node of third_nodes) {
            if (first_node.data("name") == third_node.data("name")) continue; // サーチ元とサーチ先が同じ
            if (!this.filteredfirstNames.includes(first_node.data("name")))
              continue; // サーチ元を限定する
            if (!this.filteredthirdNames.includes(third_node.data("name")))
              continue; // サーチ先を限定する

            table.push({
              first: first_node.data("name"),
              second: second_node.data("name"),
              third: third_node.data("name"),
            });
          }
        }
      }

      this.searchTable = table;
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
  border-left: 5px solid #000;
  background: #f4f4f4;
}
</style>
