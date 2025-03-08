import React from "react";

import { cn } from "@/lib/utils";
import { Monster, postDeck } from "@/lib/dataloader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ResultGraphSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
}

const ResultGraphSection: React.FC<ResultGraphSectionProps> = ({ className, deck }) => {
  const [showEdgeLabel, setShowEdgeLabel] = React.useState(false);
  const [showCardImage, setShowCardImage] = React.useState(true);

  return (
    <section
      className={cn(
        "bg-gradient-to-r bg-blue-600 shadow-2xl backdrop-blur-lg p-8 rounded-2xl text-white",
        className
      )}
    >
      <h2 className="font-bold text-3xl">グラフ</h2>

      <ul className="mt-3 text-lg list-disc list-inside">
        <li>
          スモール・ワールドを使用すると、あるモンスターから辺で繋がっっている2つ隣のモンスターがサーチできます。
        </li>
        <li>
          点の位置は、マウスでドラッグ (スマホはタップ)
          すると移動できます。見づらい場合は位置を調整してください。
        </li>
      </ul>

      {/* オプション */}
      <div className="flex space-x-2 mt-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="show-edge-label" className="bg-white" />
          <label
            htmlFor="show-edge-label"
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            辺のラベルを表示
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="show-edge-label" className="bg-white" />
          <label
            htmlFor="show-edge-label"
            className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
          >
            カード画像を表示
          </label>
        </div>
      </div>

      {/* グラフ */}
      <div className="bg-white mt-3 border-8 border-emerald-400 rounded-md w-full max-h-[800px] aspect-video">
        <div id="cy"></div>
      </div>

      {/* アクション */}
      <div className="space-y-2 mt-3">
        <div className="flex gap-2">
          <Button>画像で保存する</Button>
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
    </section>
  );
};

export { ResultGraphSection };
