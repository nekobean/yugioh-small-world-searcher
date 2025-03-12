import React from "react";

import { Monster } from "@/lib/dataloader";
import SmallWorldGraph from "@/components/graph/small-world-graph";

interface ResultGraphSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
}

const ResultGraphSection: React.FC<ResultGraphSectionProps> = ({ deck }) => {
  return (
    <section className="bg-blue-600 shadow-2xl mt-6 p-8 rounded-2xl text-white">
      <h2 className="font-bold text-3xl">グラフ</h2>

      <ul className="mt-3 text-lg list-disc list-inside">
        <li>
          スモール・ワールドを使用すると、あるモンスターから辺で繋がっっている2つ隣のモンスターがサーチできます。(起点となるモンスターを手札から除外し、1つ隣のモンスターをデッキから除外する)
        </li>
        <li>
          点の位置は、マウスでドラッグ (スマホはタップ)
          すると移動できます。見づらい場合は位置を調整してください。
        </li>
        <li>
          表示倍率は全体が収まるように適宜調整されるので、文字が小さい場合、点を内側に移動させて調整してください。
        </li>
      </ul>

      {/* グラフ */}
      <SmallWorldGraph deck={deck} />
    </section>
  );
};

export { ResultGraphSection };
