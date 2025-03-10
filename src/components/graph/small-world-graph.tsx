import React from "react";

import Cytoscape, { ElementDefinition, ExportStringOptions, StylesheetStyle } from "cytoscape";
import dagre, { DagreLayoutOptions } from "cytoscape-dagre";
import { Checkbox } from "@/components/ui/checkbox";
import { isConnected, Monster, postDeck } from "@/lib/dataloader";
import CytoscapeComponent from "react-cytoscapejs";
import { Button } from "@/components/ui/button";

Cytoscape.use(dagre);

function getEdgeLabelAndColor(a: Monster, b: Monster) {
  if (a.level === b.level) {
    return {
      label: `レベル${a.level}`,
      color: "#3157e0",
    };
  } else if (a.atk === b.atk) {
    return {
      label: `攻撃力${a.atk}`,
      color: "#FA7070",
    };
  } else if (a.def === b.def) {
    return {
      label: `守備力${a.def}`,
      color: "darkgreen",
    };
  } else if (a.attr === b.attr) {
    return {
      label: a.attr,
      color: "#FD841F",
    };
  } else {
    return {
      label: a.race,
      color: "#5ed1b2",
    };
  }
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
    if (isConnected(a, b)) {
      const { label, color } = getEdgeLabelAndColor(a, b);
      elements.push({
        data: {
          id: `${a.id}-${b.id}`,
          source: a.id,
          target: b.id,
          label: label,
          color: color,
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
  spacingFactor: 1.5,
  fit: false,
};

const exportStringOptions: ExportStringOptions = {
  bg: "#ffffff",
};

function createStylesheet(showEdgeLabel: boolean) {
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
      "font-weight": "bold",
      "background-image": "data(image)",
      "background-fit": "contain",
      "font-size": "24px",
    },
  };

  const edgeStyle: StylesheetStyle = {
    selector: "edge",
    style: {
      width: 3,
      content: showEdgeLabel ? "data(label)" : "",
      "line-color": "data(color)",
      "text-background-padding": "3px",
      "text-background-color": "white",
      "text-background-opacity": 0.8,
      "font-size": "18px",
    },
  };

  return [nodeStyle, edgeStyle];
}

function calcFontSize(cy: Cytoscape.Core) {
  const zoomFactor = 1 / cy.zoom();
  const nodeFontSize = zoomFactor * 16;
  const edgeFontSize = zoomFactor * 14;

  return { nodeFontSize, edgeFontSize };
}

interface SmallWorldGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  deck: Monster[];
}

const SmallWorldGraph: React.FC<SmallWorldGraphProps> = ({ deck }) => {
  const [showEdgeLabel, setShowEdgeLabel] = React.useState(false);
  const elements = createElements(deck);
  const cyRef = React.useRef<Cytoscape.Core>(null);

  const stylesheet = createStylesheet(showEdgeLabel);

  return (
    <div>
      {/* オプション */}
      <div className="flex space-x-2 mt-6">
        {/* 辺のラベルを表示 */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-edge-label"
            className="bg-white border-2 border-black"
            checked={showEdgeLabel}
            onCheckedChange={(checked) => setShowEdgeLabel(!!checked)}
          />
          <label htmlFor="show-edge-label" className="font-medium text-sm leading-none select-none">
            辺のラベルを表示
          </label>
        </div>
      </div>

      {/* グラフ */}
      <div className="mt-3 border-8 border-emerald-400 rounded-lg w-full max-h-[800px] aspect-16/10 text-black">
        <CytoscapeComponent
          elements={elements}
          className="bg-white size-full"
          stylesheet={stylesheet}
          cy={(cy) => {
            cyRef.current = cy;
            cy.on("add remove resize", () => {
              cy.layout(layoutOptions).run();
              cy.fit(cy.elements(), 20);
            });
            cy.on("free", () => {
              cy.fit(cy.elements(), 20);
            });
          }}
          userZoomingEnabled={false}
          userPanningEnabled={false}
          maxZoom={1}
        />
      </div>

      {/* アクション */}
      <div className="space-y-2 mt-3">
        <div className="flex gap-2">
          <Button
            disabled={!cyRef.current || deck.length === 0}
            onClick={async () => {
              if (cyRef.current) {
                const pngData = cyRef.current.png(exportStringOptions);
                const link = document.createElement("a");
                link.href = pngData;
                link.download = "small-world-graph.png";
                link.click();
              }
            }}
          >
            画像で保存する
          </Button>
          <Button onClick={() => navigator.clipboard.writeText(window.location.href)}>
            デッキの URL をコピー
          </Button>
          <Button onClick={() => postDeck(deck)}>デッキをツイート</Button>
        </div>
        <p className="text-lg">
          URL をブラウザのお気に入りに登録するか、ツイートするなど覚えておくことで、その URL
          にアクセスした際にデッキの状態が復元されます。
        </p>
      </div>
    </div>
  );
};

export default SmallWorldGraph;
