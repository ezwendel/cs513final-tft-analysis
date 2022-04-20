const fs = require("fs")
const axios = require('axios')
let date = (new Date()).toLocaleDateString()

console.log((new Date()).toLocaleDateString().split("/").join("-"))

// let json = JSON.stringify(["ksjad", "dsajkldka", "dsad"])

// let today = (new Date()).toLocaleDateString().split("/").join("-")
async function practice() {
  let {data} = await axios.get('https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/BYeUsEcJMYGzeV-DmG9YDMtKNstL4ZatqYkBpepQ56NSBU4fzO421e6lXfHHgT2VODbUcleAjBPaxA/ids?count=20&api_key=RGAPI-f6b80a5d-ebe9-4cef-9e9b-087462a71537')
  console.log(data)
  data = data.concat(["NEW GAME"])
  fs.writeFile(`./gameIdsEx.json`, JSON.stringify(data), 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }});
}

practice()