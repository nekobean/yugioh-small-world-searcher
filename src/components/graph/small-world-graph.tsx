import React from "react";

import Cytoscape, { ElementDefinition, StylesheetStyle } from "cytoscape";
import dagre, { DagreLayoutOptions } from "cytoscape-dagre";
import { Checkbox } from "@/components/ui/checkbox";
import { Monster } from "@/lib/dataloader";
import CytoscapeComponent from "react-cytoscapejs";

Cytoscape.use(dagre);

function isConnected(a: Monster, b: Monster) {
  let same = 0;
  let connection;
  if (a.level === b.level) {
    connection = {
      label: `レベル${a.level}`,
      color: "#3157e0",
    };
    same++;
  }
  if (a.atk === b.atk) {
    connection = {
      label: `攻撃力${a.atk}`,
      color: "#FA7070",
    };
    same++;
  }
  if (a.def === b.def) {
    connection = {
      label: `守備力${a.def}`,
      color: "darkgreen",
    };
    same++;
  }
  if (a.attr === b.attr) {
    connection = {
      label: a.attr,
      color: "#FD841F",
    };
    same++;
  }
  if (a.race === b.race) {
    connection = {
      label: a.race,
      color: "#5ed1b2",
    };
    same++;
  }

  return same == 1 ? connection : null;
}

function createElements(deck: Monster[]) {
  let elements: ElementDefinition[] = [];

  // 点を追加する。
  for (const monster of deck) {
    elements.push({
      data: { id: String(monster.id), monster: monster, image: `/images/${monster.id}.jpg` },
    });
  }

  const pairs = deck.flatMap((v, i) => deck.slice(i + 1).map((w) => [v, w]));

  // 辺を追加する。
  for (const [a, b] of pairs) {
    const connection = isConnected(a, b);
    if (connection) {
      elements.push({
        data: {
          id: `${a.id}_${b.id}`,
          source: a.id,
          target: b.id,
          label: connection.label,
          color: connection.color,
        },
      });
    }
  }

  return elements;
}

// Layout の設定
const layoutOptions: DagreLayoutOptions = {
  name: "dagre",
  padding: 50,
  spacingFactor: 1.2,
};

// Node のスタイル
const nodeStyle: StylesheetStyle = {
  selector: "node",
  style: {
    height: 80,
    width: 80,
    shape: "ellipse",
    content: "data(monster.name)",
    "border-color": "black",
    "border-width": 2,
    "text-valign": "bottom",
    "text-halign": "center",
    "text-margin-y": 8,
    "text-background-padding": "3px",
    "text-background-color": "white",
    "text-background-opacity": 0.8,
    "font-size": "20px",
    "font-weight": "bold",
    "background-image": "data(image)",
    "background-fit": "contain",
  },
};

function createEdgeStyle(showEdgeLabel: boolean) {
  const edgeStyle: StylesheetStyle = {
    selector: "edge",
    style: {
      width: 3,
      content: showEdgeLabel ? "data(label)" : "",
      "line-color": "data(color)",
      "text-background-padding": "3px",
      "text-background-color": "white",
      "text-background-opacity": 0.8,
      "font-size": "16px",
    },
  };

  return edgeStyle;
}

interface SmallWorldGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  deck: Monster[];
}

const SmallWorldGraph: React.FC<SmallWorldGraphProps> = ({ deck }) => {
  const [showEdgeLabel, setShowEdgeLabel] = React.useState(false);
  const [showNodeImage, setShowNodeImage] = React.useState(true);
  const elements = createElements(deck);
  const edgeStyles = createEdgeStyle(showEdgeLabel);

  return (
    <div>
      {/* オプション */}
      <div className="flex space-x-2 mt-6">
        {/* 辺のラベルを表示 */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-edge-label"
            className="bg-white"
            checked={showEdgeLabel}
            onCheckedChange={(checked) => setShowEdgeLabel(!!checked)}
          />
          <label
            htmlFor="show-edge-label"
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            辺のラベルを表示
          </label>
        </div>
        {/* カード画像を表示 */}
        {/* <div className="flex items-center space-x-2">
          <Checkbox
            id="show-node-image"
            className="bg-white"
            checked={showNodeImage}
            onCheckedChange={(checked) => setShowNodeImage(!!checked)}
          />
          <label
            htmlFor="show-node-image"
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            カード画像を表示
          </label>
        </div> */}
      </div>

      {/* グラフ */}
      <div className="mt-3 border-8 border-emerald-400 rounded-lg w-full max-h-[800px] aspect-16/10 text-black">
        <CytoscapeComponent
          elements={elements}
          className="bg-white size-full"
          stylesheet={[nodeStyle, edgeStyles]}
          cy={(cy) => {
            cy.on("add resize", () => {
              cy.layout(layoutOptions).run();
            });
            cy.on("free", () => {
              cy.fit();
            });
            cy.on("zoom", function () {
              const zoomFactor = 1 / cy.zoom();
              const nodeFontSize = zoomFactor * 20;
              const edgeFontSize = zoomFactor * 16;
              cy.style()
                .selector("edge")
                .style("font-size", String(nodeFontSize))
                .selector("node")
                .style("font-size", String(edgeFontSize))
                .update();
            });
          }}
          userZoomingEnabled={false}
          userPanningEnabled={false}
          maxZoom={1}
        />
      </div>
    </div>
  );
};

export default SmallWorldGraph;
