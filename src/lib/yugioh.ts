const JA_ID_TO_CARDTYPE: Record<number, string> = {
  1: "モンスター",
  2: "装備魔法",
  3: "フィールド魔法",
  4: "速攻魔法",
  5: "儀式魔法",
  6: "永続魔法",
  7: "通常魔法",
  8: "永続罠",
  9: "カウンター罠",
  10: "通常罠",
};

const JA_ID_TO_MONSTER_PROP: Record<number, string> = {
  1: "通常",
  2: "効果",
  3: "儀式",
  4: "融合",
  5: "シンクロ",
  6: "エクシーズ",
  7: "トゥーン",
  8: "スピリット",
  9: "ユニオン",
  10: "デュアル",
  11: "チューナー",
  12: "リバース",
  13: "ペンデュラム",
  14: "特殊召喚",
  15: "リンク",
};

const JA_ID_TO_MONSTER_RACE: Record<number, string> = {
  1: "魔法使い族",
  2: "ドラゴン族",
  3: "アンデット族",
  4: "戦士族",
  5: "獣戦士族",
  6: "獣族",
  7: "鳥獣族",
  8: "悪魔族",
  9: "天使族",
  10: "昆虫族",
  11: "恐竜族",
  12: "爬虫類族",
  13: "魚族",
  14: "海竜族",
  15: "水族",
  16: "炎族",
  17: "雷族",
  18: "岩石族",
  19: "植物族",
  20: "機械族",
  21: "サイキック族",
  22: "幻神獣族",
  23: "創造神族",
  24: "幻竜族",
  25: "サイバース族",
  26: "幻想魔族",
};

const JA_ID_TO_MONSTER_ATTR: Record<number, string> = {
  1: "闇属性",
  2: "光属性",
  3: "地属性",
  4: "水属性",
  5: "炎属性",
  6: "風属性",
  7: "神属性",
};

const EN_ID_TO_CARD_TYPE: Record<number, string> = {
  1: "Monster",
  2: "Equip Spell",
  3: "Field Spell",
  4: "Quick-Play Spell",
  5: "Ritual Spell",
  6: "Continuous Spell",
  7: "Normal Spell",
  8: "Continuous Trap",
  9: "Counter Trap",
  10: "Normal Trap",
};

const EN_ID_TO_MONSTER_PROP: Record<number, string> = {
  1: "Normal",
  2: "Effect",
  3: "Ritual",
  4: "Fusion",
  5: "Synchro",
  6: "Xyz",
  7: "Toon",
  8: "Spirit",
  9: "Union",
  10: "Gemini",
  11: "Tuner",
  12: "Flip",
  13: "Pendulum",
  14: "Special Summon",
  15: "Link",
};

const EN_ID_TO_MONSTER_RACE: Record<number, string> = {
  1: "Spellcaster",
  2: "Dragon",
  3: "Zombie",
  4: "Warrior",
  5: "Beast-Warrior",
  6: "Beast",
  7: "Winged Beast",
  8: "Fiend",
  9: "Fairy",
  10: "Insect",
  11: "Dinosaur",
  12: "Reptile",
  13: "Fish",
  14: "Sea Serpent",
  15: "Aqua",
  16: "Pyro",
  17: "Thunder",
  18: "Rock",
  19: "Plant",
  20: "Machine",
  21: "Psychic",
  22: "Divine-Beast",
  23: "Creation God",
  24: "Wyrm",
  25: "Cyberse",
  26: "Illusionist",
};

const EN_ID_TO_MONSTER_ATTR: Record<number, string> = {
  1: "DARK",
  2: "LIGHT",
  3: "EARTH",
  4: "WATER",
  5: "FIRE",
  6: "WIND",
  7: "DIVINE",
};

export {
  JA_ID_TO_CARDTYPE,
  JA_ID_TO_MONSTER_PROP,
  JA_ID_TO_MONSTER_RACE,
  JA_ID_TO_MONSTER_ATTR,
  EN_ID_TO_CARD_TYPE,
  EN_ID_TO_MONSTER_PROP,
  EN_ID_TO_MONSTER_RACE,
  EN_ID_TO_MONSTER_ATTR,
};
