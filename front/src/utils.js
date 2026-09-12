import { skills, C } from './data'

export const char = (id) => C.find((c) => c.id === id);

export const mod = (c, s) =>
  c?.skills[s] ?? 0;

const resultDict = {
  SUCCESS: "Success",
  CRITICAL_FAILURE: "Critical Failure",
  CRITICAL_SUCCESS: "Critical Success",
  FAILURE: "Failure",
  JUST_MADE_IT: "Just made it",
  JUST_DIDNT_MAKE_IT: "Just didn't make it"
}

const lvlToResult = (lvl) => {
  if (lvl <= -2) {
    return resultDict.CRITICAL_FAILURE
  } else if (lvl < 0) {
    return resultDict.FAILURE
  } else if (lvl == 0) {
    return resultDict.SUCCESS
  } else {
    return resultDict.CRITICAL_SUCCESS
  }
}

const compareDcWithRoll = (roll, dc, d20) => {
  let level = 0
  if (roll + 10 < dc) {
    level -= 2
  } else if (roll < dc) {
    level -= 1
  } else if (roll >= dc + 10) {
    level += 1
  } else {
    level += 0
  }

  if (d20 === 20) {
    level += 1
  }
  if (d20 === 1) {
    level -= 1
  }

  return {
    result: lvlToResult(level),
    nat20: d20 === 20,
    nat1: d20 === 1
  }
}

const rollD20 = () => Math.ceil(Math.random() * 20)

const handleAid = (cfg, aid) => {
  const aider = cfg.characters[aid.aiderId],
    d20 = rollD20(),
    aiderSkill = mod(aider, aid.skill);

  const r = compareDcWithRoll(d20 + aiderSkill, aid.dc, d20)

  return {
    aider,
    skillName: aid.skill,
    d20: d20,
    bonus: aiderSkill,
    total: d20 + aiderSkill,
    aidResult: r,
    aidDc: aid.dc,
    checkBoost: r.result === resultDict.CRITICAL_SUCCESS ? aid.bonuses.critSuccess : r.result === resultDict.CRITICAL_FAILURE ? aid.bonuses.critFail : r.result === resultDict.SUCCESS ? aid.bonuses.success : aid.bonuses.fail
  };
}

export default function roll(cfg) {
  return {
    ...cfg,
    results: cfg.selected.map((id) => {
      const character = cfg.characters[id];
      const charSkill = mod(character, cfg.skill);
      const d20 = rollD20();

      const aids = cfg.aids
        .filter((a) => a.targetId === id)
        .map((a) => handleAid(cfg, a));

      const aidBonus = aids.length > 0 ? aids.reduce((acc, curr) => acc += curr.checkBoost, 0) : 0
      const total = d20 + charSkill + aidBonus;
      const { result, nat20, nat1 } = compareDcWithRoll(total, cfg.dc, d20)

      let just = ""
      if (total >= cfg.dc && total - 3 < cfg.dc) {
        just = "Just made it"
      } else if (total + 2 >= cfg.dc && total <= cfg.dc) {
        just = "Just didn't make it"
      }

      if (nat20 || nat1) {
        just = ""
      }

      return { characterId: id, character, d20, charSkill, aidBonus, total, result, aids, nat1, nat20, dc: cfg.dc, just };
    }),
  };
}
