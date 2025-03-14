import packageJson from "../../package.json";

const Jumbotron = () => {
  return (
    <section className="bg-blue-600 shadow-2xl p-8 rounded-2xl text-white">
      {/* Title */}
      <div className="flex">
        <img src="small_world.png" alt="Small World" className="mr-3 w-12 aspect-auto" />
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

        <div
          className="flex items-center bg-green-600 mt-3 px-4 py-3 rounded-md text-white text-lg"
          role="alert"
        >
          <div className="py-1">
            <svg
              className="fill-current mr-4 w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>

          <p>バージョン更新しました。不具合や以前より使いづらくなっていたら教えてください。</p>
        </div>
      </div>
    </section>
  );
};

export { Jumbotron };
