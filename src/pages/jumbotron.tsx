import packageJson from "../../package.json";

const Jumbotron = () => {
  return (
    <section className="bg-blue-600 shadow-2xl backdrop-blur-lg p-10 rounded-2xl text-white">
      {/* Title */}
      <div className="flex">
        <img
          src="/small_world.png"
          alt="Small World"
          className="mr-3 w-12 aspect-auto"
        />
        <div>
          <h1 className="font-bold text-4xl">遊戯王 スモールワールド検索ツール</h1>
          <p className="mt-1 text-lg">
            バージョン: {packageJson.version} カードデータ更新日: 2025/3/1
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-3">
        <p className="text-lg">
          <a
            href="https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=16555"
            target="_blank"
            className="link"
          >
            スモールワールド
          </a>
          を使用して、デッキ内でサーチ可能なルートの可視化、中継ぎカードの検索を行えるツールです。
          ツールの使い方は
          <a
            href="https://pystyle.info/yugioh-small-world-searcher/"
            target="_blank"
            className="link"
          >
            こちら
          </a>
          を参照してください。
        </p>
        <p className="text-lg">
          不具合報告、機能追加の要望、ご質問はこちらの
          <a
            href="https://pystyle.info/yugioh-small-world-searcher/#respond"
            target="_blank"
            className="link"
          >
            コメント欄
          </a>
          にお願いします。
        </p>
      </div>
    </section>
  );
};

export { Jumbotron };
