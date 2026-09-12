const fs = require('fs')
const path = require("path");

const getHistory = () => JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db/history.json')).toString())

const saveHistory = (histroyEntry) => {
    const h = getHistory()
    h.push({...histroyEntry, time: new Date().toISOString()})

    fs.writeFileSync(path.resolve(__dirname, 'db/history.json'), JSON.stringify(h, null, 2))
}

const clearHistory = () => {
    fs.writeFileSync(path.resolve(__dirname, 'db/history.json'), JSON.stringify([], null, 2))
}

module.exports = {
    getHistory,
    saveHistory,
    clearHistory
}