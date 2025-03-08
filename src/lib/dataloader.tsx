import * as yugioh from "@/lib/yugioh";

export interface Monster {
  id: number;
  name: string;
  ruby: string;
  race: number;
  attr: number;
  level: number;
  atk: number | "-" | "?";
  def: number | "-" | "?";
  prop: string[];
  text: string;
  sanitizedName: string;
  sanitizedRuby: string;
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

function parseMonsterList(monsters: any): Monster[] {
  for (let monster of monsters) {
    monster.sanitizedName = sanitizeString(monster.name);
    monster.sanitizedRuby = monster.ruby !== null ? sanitizeString(monster.ruby) : "";
    monster.prop = monster.prop.map((x: number) => yugioh.JA_ID_TO_MONSTER_PROP[x]);
    monster.race = yugioh.JA_ID_TO_MONSTER_RACE[monster.race];
    monster.attr = yugioh.JA_ID_TO_MONSTER_ATTR[monster.attr];
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
