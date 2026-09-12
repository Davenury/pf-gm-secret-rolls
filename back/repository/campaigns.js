const { players, savePlayers } = require("./players")

const getCampaigns = () => {
    return Object.keys(players())
}

const addCampaign = (campaign) => {
    allPlayers = players()
    if (!allPlayers[campaign]) {
        allPlayers[campaign] = {}

        savePlayers(allPlayers)
    }
}

module.exports = {
    getCampaigns,
    addCampaign
}
