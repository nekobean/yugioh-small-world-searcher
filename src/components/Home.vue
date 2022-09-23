<template>
  <div>
    <!-- 使い方 -->
    <h2 class="header-name">使い方</h2>

    <div>
      <p class="ma-2">
        「デッキ入力」のセレクトボックスからモンスターカードを選択し、
        「追加」ボタンをクリックすることでカードが追加されます。<br />
        セレクトボックスで選択する際、
        カード名の一部を入力すると名前にその文字を含むモンスターカードの候補が表示されます。<br />
        カードを追加していくと、「スモールワールドの結果」にスモールワールドで検索できるカードを可視化したグラフ及び早見表が表示されます。
      </p>
    </div>

    <!-- デッキ入力 -->
    <h2 class="header-name">デッキ入力</h2>
    {{ test }}
    <v-container fluid>
      <v-row>
        <!-- モンスター選択 -->
        <v-col cols="auto">
          <v-autocomplete
            v-model="selectMonster"
            :items="monsters"
            item-text="name"
            return-object
            style="width: 500px"
          ></v-autocomplete>
          <v-btn @click="addMonster" color="primary">追加</v-btn>
        </v-col>

        <!-- モンスター情報 -->
        <v-col>
          <v-simple-table v-if="selectMonster" dense>
            <tbody>
              <tr>
                <th style="width: 150px">カード名</th>
                <td>
                  <template v-if="selectMonster.name != selectMonster.ruby">
                    <!-- カード名と読みが異なる場合 -->
                    <ruby>
                      <rb>{{ selectMonster.name }}</rb>
                      <rt>{{ selectMonster.ruby }}</rt>
                    </ruby>
                  </template>
                  <template v-else>{{ selectMonster.name }}</template>
                </td>
              </tr>
              <tr>
                <th>種族</th>
                <td>{{ selectMonster.type }}</td>
              </tr>
              <tr>
                <th>属性</th>
                <td>{{ selectMonster.attribute }}</td>
              </tr>
              <tr>
                <th>レベル</th>
                <td>{{ selectMonster.level }}</td>
              </tr>
              <tr>
                <th>攻撃力</th>
                <td>{{ selectMonster.attack }}</td>
              </tr>
              <tr>
                <th>防御力</th>
                <td>{{ selectMonster.defence }}</td>
              </tr>
              <tr>
                <th>テキスト</th>
                <td>
                  {{ selectMonster.text }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="cardTableHeader"
            :items="deck"
            hide-default-footer
            disable-pagination
          >
            <template #[`item.delete`]="{ item }">
              <v-btn @click="deleteMonster(item)" color="primary">削除</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <h2 class="header-name">グラフ</h2>
    <v-checkbox
      v-model="hideEdgeLabel"
      label="辺のラベルを表示する"
      @click="updateEdgeLabel"
    ></v-checkbox>
    <div id="cy"></div>

    <h2 class="header-name">早見表</h2>

    <v-container>
      <v-row>
        <v-col>
          手札から除外するカードを限定する
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
import monsters from "../assets/monsters_jp.json";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

export default {
  name: "Home",
  components: {},
  data: () => ({
    test: null,
    monsters: monsters,
    selectMonster: null,
    deck: [],
    hideEdgeLabel: false,
    cardTableHeader: [
      { text: "名前", value: "name" },
      { text: "種族", value: "type" },
      { text: "属性", value: "attribute" },
      { text: "レベル", value: "level" },
      { text: "攻撃力", value: "attack" },
      { text: "防御力", value: "defence" },
      { text: "", value: "delete" },
    ],
    searchTableHeader: [
      { text: "手札から除外するカード", value: "first" },
      { text: "デッキから除外するカード", value: "second" },
      { text: "サーチ先", value: "third" },
    ],
    searchTable: [],
    searchTableSortBy: "third",
    filteredfirstNames: [], // サーチ元をフィルタする場合
    filteredthirdNames: [], // サーチ先をフィルタする場合

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

    // for (let monster of this.monsters) {
    //   if (monster.name.includes("電脳")) {
    //     this.selectMonster = monster;
    //     this.addMonster();
    //   }
    //   if (monster.name.includes("うらら")) {
    //     this.selectMonster = monster;
    //     this.addMonster();
    //   }
    //   if (monster.name.includes("増殖")) {
    //     this.selectMonster = monster;
    //     this.addMonster();
    //   }
    // }
  },

  methods: {
    addMonster() {
      if (!this.selectMonster) return;

      let found = this.deck.find((x) => {
        return x.name === this.selectMonster.name;
      });
      if (found) return;

      this.deck.push(this.selectMonster);
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
      for (let key of ["type", "attribute", "level", "attack", "defence"]) {
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
          } else if (key == "attribute") {
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
