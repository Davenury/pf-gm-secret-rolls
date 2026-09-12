const { getPlayersFromCampaign, createPlayer, deletePlayer, updatePlayer } = require('./repository/players')
const { getBasicSkills } = require('./repository/skills')
const { getCampaigns, addCampaign } = require('./repository/campaigns')
const { saveNoteForPlayer, deleteNoteForPlayer } = require('./repository/notes')
const { saveHistory, getHistory, clearHistory } = require('./repository/history')
const path = require("path")

const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors())
app.use(express.json({ limit: '10mb' }));

app.get('/api/v1/campaigns', (req, res) => {
      const campaigns = getCampaigns()
      res.json(campaigns)
})

app.post('/api/v1/campaigns', (req, res) => {
      const campaign = req.body.campaign
      addCampaign(campaign)
      res.send("OK")
})

app.get('/api/v1/players', (req, res) => {
      const campaign = req.query.campaign
      res.json(getPlayersFromCampaign(campaign))
})

app.get('/api/v1/skills/basic', (req, res) => {
      res.json(getBasicSkills())
})

app.post('/api/v1/players/:campaign', (req, res) => {
      const player = req.body
      const err = createPlayer(player, req.params.campaign)
      if (err != "") {
            res.status(400).send(err)
      } else {
            res.send("OK")
      }
})

app.patch('/api/v1/players/:campaign/:playerId', (req, res) => {
      const campaign = req.params.campaign
      const playerId = req.params.playerId
      const player = req.body

      const err = updatePlayer(playerId, player, campaign)

      if (err != "") {
            res.status(400).send(err)
      } else {
            res.send("OK")
      }
})

app.delete('/api/v1/players/:playerId', (req, res) => {
      const playerId = req.params.playerId
      deletePlayer(playerId)
      res.send("OK")
})

app.post('/api/v1/notes/:campaignId/:playerId', (req, res) => {
      const note = req.body
      const playerId = req.params.playerId
      const campaignId = req.params.campaignId
      saveNoteForPlayer(note, campaignId, playerId)
      res.send("OK")
})

app.delete('/api/v1/notes/:campaignId/:playerId/:noteId', (req, res) => {
      const noteId = req.params.noteId
      const playerId = req.params.playerId
      const campaignId = req.params.campaignId
      deleteNoteForPlayer(noteId, campaignId, playerId)
      res.send("OK")
})

app.post('/api/v1/history', (req, res) => {
      const historyEntry = req.body

      saveHistory(historyEntry)
      res.send("OK")
})

app.get('/api/v1/history', (req, res) => {
      res.json(getHistory())
})

app.delete('/api/v1/history', (req, res) => {
      clearHistory()
      res.send("OK")
})

app.use(express.static(path.join(__dirname, '../front/build')))

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/build/index.html'))
})

app.listen(8080, () => {
      console.log('server listening on port 8080')
})