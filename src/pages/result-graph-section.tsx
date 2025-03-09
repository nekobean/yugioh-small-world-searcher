import React from "react";

import { Monster } from "@/lib/dataloader";
import SmallWorldGraph from "@/components/graph/small-world-graph";

interface ResultGraphSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
}

const ResultGraphSection: React.FC<ResultGraphSectionProps> = ({ deck }) => {
  return (
    <section>
      <ul className="mt-3 text-lg list-disc list-inside">
        <li>
          スモール・ワールドを使用すると、あるモンスターから辺で繋がっっている2つ隣のモンスターがサーチできます。
        </li>
        <li>
          点の位置は、マウスでドラッグ (スマホはタップ)
          すると移動できます。見づらい場合は位置を調整してください。
        </li>
      </ul>

      {/* グラフ */}
      <SmallWorldGraph deck={deck} />
    </section>
  );
};

export { ResultGraphSection };
