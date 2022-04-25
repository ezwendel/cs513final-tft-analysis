const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]
const all_augments = JSON.parse(fs.readFileSync(`./all_augments.json`,'utf8'))
const all_items = JSON.parse(fs.readFileSync(`./all_items.json`,'utf8'))
const all_champs = JSON.parse(fs.readFileSync(`./all_champs.json`,'utf8'))



function compile_items(player) {
  let items = {}
  for (let item of all_items) {
    items[item] = 0
  }
  for (let unit of player.units) { // go through units to get items
    for (let item of unit.items) {
      items[item] += 1
    }
  }
  return items
}

function compile_traits(player) {
  let traits = {arcanist: 0, assassin: 0, bodyguard: 0, bruiser: 0, challenger: 0, colossus: 0, enchanter: 0, innovator: 0, mastermind: 0, scholar: 0, sniper: 0, 
    transformer: 0, twinshot: 0, chemtech: 0, clockwork: 0, debonair: 0, enforcer: 0, glutton: 0, hextech: 0, mercenary: 0, mutant: 0, rivals: 0, scrap: 0, 
    socialite: 0, striker: 0, syndicate: 0, yordle: 0, yordlelord: 0} // all the traits
  for (let trait of player.traits) {
    let name = trait.name.toLowerCase().substring(5) // first 5 chars are "Set6_"
    traits[name] = trait.tier_current // trait.tier_current has the current trait number (usually out of 3 or 4)
  }
  return traits;
}

function compile_champs(player) {
  let champs = { duplicates: 0 }
  for (let champ of all_champs) {
    champs[champ] = 0
  }
  for (let unit of player.units) { // go through units
    if (champs[unit.character_id] != 0) { // account for duplicates
      champs.duplicates += 1;
      champs[unit.character_id] = Math.max(champs[unit.character_id], unit.tier)
    } else {
      champs[unit.character_id] = unit.tier
    }
  }
  return champs;
}

function compile_augments(player) {
  let augments = {}
  for (let augment of all_augments) {
    augments[augment] = 0
  }
  for (let augment of player.augments) {
    augments[augment] += 1;
  }
  return augments;
}

const firstFullDayOfPatch = new Date(2022, 3, 7, 0, 0, 0, 0)
const lastDayOfPatch = new Date(2022, 3, 13, 0, 0, 0, 0)

function game_to_stats(game) {
  let players = []
  let gametime = new Date(game.info.game_datetime);
  if (gametime > lastDayOfPatch || gametime < firstFullDayOfPatch) {
    return players;
  }
  for (let player of game.info.participants) {
    let top4 = false;
    if (player.placement <= 4) {
      top4 = true;
    }
    let stats = {
      match_id: game.metadata.match_id,
      placement: player.placement,
      top4: top4,
      ...compile_items(player),
      ...compile_traits(player),
      ...compile_champs(player),
      ...compile_augments(player),
    }
    // console.log(Object.keys(stats).length)
    players.push(stats)
  }
  return players
  // return { match_id: game.metadata.match_id, game_datetime: game.info.game_datetime, players: players }
}

function file_to_games(region) {
  let rawData = fs.readFileSync(`./gameData/full/${region}_games_all.json`)
  let regionData = JSON.parse(rawData)
  // let matches = []
  // for (game of regionData) {
  //   let info = game_to_stats(game);
  //   matches.push(info);
  // }
  // let jsonData = JSON.stringify(matches)
  let players = []
  for (game of regionData) {
    let info = game_to_stats(game)
    players = players.concat(info)
  }
  let jsonData = JSON.stringify(players) 
  console.log(`Number of ${region} placements: ${players.length}`)
  fs.writeFile(`./finalDataALL/${region}_data.json`, jsonData, 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }});
}

// for (let region of regions) {
//   file_to_games(region);
// }


let player = require('./sample_player.json');
let stats = {
  ...compile_items(player),
  ...compile_traits(player),
  ...compile_champs(player),
  ...compile_augments(player),
}
console.log(stats)
