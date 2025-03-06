import React from "react";
import packageJson from "../../package.json";

const Jumbotron = () => {
  return (
    <div className="bg-green-300/50 shadow-lg backdrop-blur-lg p-8 border border-white/15 rounded-xl text-black">
      <h1 className="font-bold text-4xl">遊戯王 スモールワールド検索ツール</h1>
      <p className="mt-1 text-lg">
        バージョン: {packageJson.version} カードデータ更新日: 2025/3/1
      </p>

      <div className="mt-3">
        <p className="text-lg">
          <a
            href="https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=16555"
            target="_blank"
          >
            スモールワールド
          </a>
          を使用して、デッキ内でサーチ可能なルートの可視化、中継ぎカードの検索を行えるツールです。
          ツールの使い方は
          <a href="https://pystyle.info/yugioh-small-world-searcher/" target="_blank">
            こちら
          </a>
          を参照してください。
        </p>
        <p className="text-lg">
          不具合報告、機能追加の要望、ご質問はこちらの記事の
          <a
            href="https://pystyle.info/yugioh-small-world-searcher/#respond"
            target="_blank"
          >
            コメント欄
          </a>
          にお願いします。
        </p>
      </div>
    </div>
    // </section>
  );
};

export { Jumbotron };
