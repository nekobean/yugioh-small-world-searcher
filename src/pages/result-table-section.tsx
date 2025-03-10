import React from "react";

import { getSearchPatterns, Monster, SearchPath } from "@/lib/dataloader";
import { SearchPathDataTable } from "@/components/paths/data-table";
import { pathColumns } from "@/components/paths/columns";

interface ResultTableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  deck: Monster[];
}

const ResultTableSection: React.FC<ResultTableSectionProps> = ({ deck }) => {
  const searchPaths = getSearchPatterns(deck);
  const filteredSearchPaths = searchPaths.filter((path) => path.source.id !== path.target.id);

  return (
    <section>
      <ul className="mt-3 text-lg list-disc list-inside">
        <li>サーチパターンを限定したい場合は、チェックを外してください。</li>
        <li>テーブルのカラムをクリックすると、ソートできます。</li>
      </ul>

      <SearchPathDataTable columns={pathColumns} data={filteredSearchPaths} className="mt-3" />
    </section>
  );
};

export { ResultTableSection };
