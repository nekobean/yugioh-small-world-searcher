import * as yugioh from "@/lib/yugioh";

export interface Monster {
  id: number;
  name: string;
  ruby: string;
  race: string;
  attr: string;
  level: number;
  atk: number | "-" | "?";
  def: number | "-" | "?";
  prop: string[];
  text: string;
  sanitizedName: string;
  sanitizedRuby: string;
  sanitizedProp: string[];
}

export function sanitizeString(s: string): string {
  // 全角英数字は半角英数字に変換する。
  s = s.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  );

  // カタカナはひらがなに変換する。
  s = s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x0060));

  // 半角大文字英数字は小文字にする。
  s = s.toLowerCase();

  // 以下で定義する文字以外を削除する。
  // アルファベット: \w
  // 数字: \d
  // 漢字: \u4E00-\u9FFF
  // ひらがな: \u3041-\u3096
  // ギリシャ文字: \u0391-\u03A9\u03B1-\u03C9
  // ローマ数字: \u2160-\u216C
  // ー: \u30fc
  s = s.replace(
    /[^\w\d\u3041-\u3096\u4E00-\u9FFF\u0391-\u03A9\u03B1-\u03C9\u2160-\u216C\u30fc]/g,
    ""
  );

  return s;
}

function parseMonsterList(data: any): Monster[] {
  let monsters = [];
  for (let row of data) {
    monsters.push({
      id: row.id,
      name: row.name,
      ruby: row.ruby ? row.ruby : "",
      race: yugioh.JA_ID_TO_MONSTER_RACE[row.race],
      attr: yugioh.JA_ID_TO_MONSTER_ATTR[row.attr],
      level: row.level,
      atk: row.atk,
      def: row.def,
      prop: row.prop.map((x: number) => yugioh.JA_ID_TO_MONSTER_PROP[x]),
      text: row.text,
      sanitizedName: sanitizeString(row.name),
      sanitizedRuby: row.ruby ? sanitizeString(row.ruby) : "",
      sanitizedProp: row.prop.map((x: number) => sanitizeString(yugioh.JA_ID_TO_MONSTER_PROP[x])),
    });
  }

  return monsters;
}

export function loadMonsterList(filePath: string, setMonsters: (monsters: Monster[]) => void) {
  fetch(filePath)
    .then((response) => response.json())
    .then((data) => setMonsters(parseMonsterList(data)))
    .catch((error) => console.error("Failed to load json.", error));
}

export function officialUrl(card_id: number): string {
  return `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${card_id}&request_locale=ja`;
}

export function formatCardText(text: string) {
  // "①～⑨："で分割する。
  const splittedText = text.split(/(?=[\u2460-\u2468]：)/);

  return (
    <>
      <div className="space-y-2">
        {splittedText.map((x, index) => (
          <p key={index}>{x}</p>
        ))}
      </div>
    </>
  );
}

export function getDeckURL(deck: Monster[]) {
  const cardIds = deck.map((monster) => monster.id).sort((a, b) => a - b);

  if (cardIds.length === 0) {
    return "/apps/yugioh-small-world-searcher/";
  } else {
    return `/apps/yugioh-small-world-searcher/?card_id=${encodeURIComponent(cardIds.join(","))}`;
  }
}

export function postDeck(deck: Monster[]) {
  const app_url = getDeckURL(deck);

  let text = "";
  text += "【遊戯王 - スモールワールド検索ツール】\n";
  text += app_url + "\n\n";
  text += "#遊戯王 #マスターデュエル";

  const x_url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(x_url, "_blank");
}

export function isConnected(a: Monster, b: Monster) {
  let same = 0;
  let connection;
  if (a.level === b.level) {
    connection = {
      label: `レベル${a.level}`,
      color: "#3157e0",
    };
    same++;
  }
  if (a.atk === b.atk) {
    connection = {
      label: `攻撃力${a.atk}`,
      color: "#FA7070",
    };
    same++;
  }
  if (a.def === b.def) {
    connection = {
      label: `守備力${a.def}`,
      color: "darkgreen",
    };
    same++;
  }
  if (a.attr === b.attr) {
    connection = {
      label: a.attr,
      color: "#FD841F",
    };
    same++;
  }
  if (a.race === b.race) {
    connection = {
      label: a.race,
      color: "#5ed1b2",
    };
    same++;
  }

  return same == 1 ? connection : null;
}
