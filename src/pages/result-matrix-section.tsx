import React from "react";
import { Circle } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Monster, SearchPath } from "@/lib/dataloader";
import { cn } from "@/lib/utils";

interface SearchMatrixProps extends React.HTMLAttributes<HTMLTableElement> {
  deck: Monster[];
  searchPaths: SearchPath[];
}

const SearchMatrix: React.FC<SearchMatrixProps> = ({ deck, searchPaths, className }) => (
  <table
    className={cn(
      "bg-white [&_th,&_td]:p-1 [&_th,&_td]:border-2 [&_th,&_td]:border-gray-500 text-black [&_th,&_td]:text-center",
      className
    )}
  >
    <thead>
      {/* サーチ先 */}
      <tr>
        <th colSpan={2} rowSpan={2}></th>
        <th colSpan={deck.length}>サーチ先</th>
      </tr>
      {/* サーチ先のカード名 */}
      <tr>
        {deck.map((card) => (
          <th key={card.name}>
            <span
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              className="display-inline-block whitespace-pre"
            >
              {card.name}
            </span>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {/* サーチ元のカード名 */}
      {deck.map((srcMonster, i) => (
        <tr key={srcMonster.name}>
          {i === 0 && (
            <th rowSpan={deck.length}>
              <span
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                className="display-inline-block whitespace-pre"
              >
                サーチ元
              </span>
            </th>
          )}
          <th>{srcMonster.name}</th>
          {deck.map((dstMonster) => {
            const path = searchPaths.find(
              (path) => path.source.id === srcMonster.id && path.target.id === dstMonster.id
            );
            return path ? (
              <td key={dstMonster.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Circle size={16} className="text-green-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <ul>
                        {path.middles.map((monster) => (
                          <li key={monster.id} className="text-lg">
                            {monster.name}
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
            ) : (
              <td key={dstMonster.id}></td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

interface ResultMatrixSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
  searchPaths: SearchPath[];
}

const ResultMatrixSection: React.FC<ResultMatrixSectionProps> = ({ deck, searchPaths }) => {
  return (
    <section>
      <ul className="mt-3 text-lg list-disc list-inside">
        <li>
          ○がついている場合、サーチ元のモンスターを手札から除外し、サーチ先のモンスターをサーチすることが可能であることを意味します。
        </li>
        <li>○にマウスカーソルを合わせると、中継ぎカードが表示されます。</li>
      </ul>

      <SearchMatrix deck={deck} searchPaths={searchPaths} className="mt-3" />
    </section>
  );
};

export { ResultMatrixSection };
