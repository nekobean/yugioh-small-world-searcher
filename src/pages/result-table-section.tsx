import React from "react";

import { getSearchPatterns, Monster, SearchPath } from "@/lib/dataloader";

interface ResultTableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
}

const ResultTableSection: React.FC<ResultTableSectionProps> = ({ deck }) => {
  const searchPaths = getSearchPatterns(deck);

  return (
    <section>
      <ul className="mt-3 text-lg list-disc list-inside">
        <li>サーチパターンを限定したい場合は、チェックを外してください。</li>
        <li>テーブルのカラムをクリックすると、ソートできます。</li>
      </ul>
    </section>
  );
};

export { ResultTableSection };
