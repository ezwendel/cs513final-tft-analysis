const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]

async function get_challengers(region) {
  const { data } = await axios.get(`https://${region}.api.riotgames.com/tft/league/v1/challenger?api_key=${api_key}`)
  let json = JSON.stringify(data.entries)
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  fs.writeFile(`./challengerPlayers/${today}/${region}_chall_${today}.json`, json, 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }});
}

for (let region of regions) {
  get_challengers(region)
}