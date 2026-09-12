export const C = [
  {
    id: "kara",
    name: "Kara",
    type: "Human Rogue",
    avatar: "K",
    perception: 11,
    nature: 3,
    stealth: 10,
  },
  {
    id: "aelwyn",
    name: "Aelwyn",
    type: "Elf Wizard",
    avatar: "A",
    perception: 9,
    nature: 7,
    stealth: 5,
  },
  {
    id: "borin",
    name: "Borin",
    type: "Dwarf Fighter",
    avatar: "B",
    perception: 7,
    nature: 2,
    stealth: 3,
  },
  {
    id: "nyx",
    name: "Nyx",
    type: "Wolf Animal Companion",
    avatar: "N",
    perception: 8,
    nature: 8,
    stealth: 9,
  },
  {
    id: "marek",
    name: "Marek",
    type: "Human Cleric",
    avatar: "M",
    perception: 5,
    nature: 6,
    stealth: 2,
  },
  {
    id: "scout",
    name: "Scout",
    type: "Animal Companion",
    avatar: "S",
    perception: 6,
    nature: 6,
    stealth: 7,
  },
];

export const skills = (characters) => {
  if (!characters) return []
  return [...new Set(Object.values(characters).flatMap(char => [...Object.keys(char.skills ?? {})]))]
}
