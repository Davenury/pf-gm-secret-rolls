const lvlToResult = (lvl) => {
  if (lvl <= -2) {
    return "Critical Failure"
  } else if (lvl < 0) {
    return "Failure"
  } else if (lvl == 0) {
    return "Success"
  } else {
    return "Critical Success"
  }
}

const compareDcWithRoll = ({roll, dc, d20}) => {

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
    text: lvlToResult(level),
    nat20: d20 === 20,
    nat1: d20 === 1,
    nat: d20
  }
}

const tests = [
    // crit fail
    {
        roll: 10,
        dc: 15,
        d20: 1
    },
    // fail
    {
        roll: 16,
        dc: 15,
        d20: 1
    },
    // fail
    {
        roll: 10,
        dc: 15,
        d20: 4
    },
    // success
    {
        roll: 16,
        dc: 15,
        d20: 4
    },
    // success
    {
        roll: 10,
        dc: 15,
        d20: 20
    },
    // crit success
    {
        roll: 17,
        dc: 15,
        d20: 20
    },
    // crit success
    {
        roll: 26,
        dc: 15,
        d20: 6
    },
    // Failure
    {
        roll: 4,
        dc: 15,
        d20: 20
    },
    // crit success
    {
        roll: 26,
        dc: 15,
        d20: 20
    },
    // success
    {
        roll: 26,
        dc: 15,
        d20: 1
    },
    // crit fail
    {
        roll: 3,
        dc: 15,
        d20: 1
    },
    // fail
    {
        roll: 24,
        dc: 15,
        d20: 1
    },
]

tests.map(it => compareDcWithRoll(it)).forEach(it => console.log(it.text))