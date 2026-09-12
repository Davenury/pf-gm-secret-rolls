const { players, savePlayers } = require("./players")
const v4 = require('uuid')

const saveNoteForPlayer = (note, campaignId, playerId) => {
    const allPlayers = players()

    const player = allPlayers[campaignId]?.[playerId]
    if (!player.notes) {
        player["notes"] = []
    }

    player["notes"].push({...note, noteId: v4.v4()})

    savePlayers(allPlayers)
}

const deleteNoteForPlayer = (noteId, campaignId, playerId) => {
    const allPlayers = players()

    const player = allPlayers[campaignId]?.[playerId]

    player.notes = player.notes.filter(note => note.noteId != noteId)

    savePlayers(allPlayers)
}

module.exports = {
    saveNoteForPlayer,
    deleteNoteForPlayer
}