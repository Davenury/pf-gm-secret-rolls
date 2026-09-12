const fs = require('fs')
const v4 = require('uuid')
const path = require("path");

const players = () => JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db/db.json')).toString())
const savePlayers = (allPlayers) => fs.writeFileSync(path.resolve(__dirname, 'db/db.json'), JSON.stringify(allPlayers, null, 2))

const getPlayersFromCampaign = (campaign) => {
    if (!campaign) return players()
    return players()?.[campaign] ?? {}
}

const createPlayer = (player, campaign) => {
    const allPlayers = players() ?? {}
    const playerId = v4.v4()

    if (!allPlayers[campaign]) {
        return `Campaign ${campaign} does not exist!`
    }

    allPlayers[campaign][playerId] = player

    savePlayers(allPlayers)
    return ""
}

const deletePlayer = (playerId) => {
    const allPlayers = players() ?? {}

    for (const players of Object.values(allPlayers)) {
        if (players[playerId]) {
            delete players[playerId];
            break;
        }
    }

    savePlayers(allPlayers)
    
    return
}

const updatePlayer = (playerId, player, campaign) => {
    const allPlayers = players()

    if (!allPlayers[campaign]) {
        return `Campaign ${campaign} does not exist`
    }
    if (!allPlayers[campaign][playerId]) {
        return `Player with id ${playerId} does no exist`
    }

    allPlayers[campaign][playerId] = player

    savePlayers(allPlayers)

    return ""
}

module.exports = {
    players,
    savePlayers,
    getPlayersFromCampaign,
    createPlayer,
    deletePlayer,
    updatePlayer
}