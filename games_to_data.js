const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]
// The AMERICAS routing value serves NA, BR, LAN, LAS, and OCE. The ASIA routing value serves KR and JP. The EUROPE routing value serves EUNE, EUW, TR, and RU.
const americas = ["NA1", "BR1", "LA1", "LA2", "OC1"]
const asia = ["KR", "JP1"]
const europe = ["EUN1", "EUW1", "TR1", "RU"]
const continents = ["americas", "asia", "europe"]
const rod_items = [33, 34, 35, 36, 37, 39, 23, 13, 38] // rabadons, archangels, locket, spark, morello, jg, guinsoos, gunblade, arcanist emblem
const sword_items = [11, 12, 13, 14, 15, 16, 17, 19, 18] // db, gs, gunblade, shojin, edge of night, bt, zekes, ie, striker emblem
const spat_items = [18, 28, 38, 48, 58, 68, 78, 89] // striker, challenger, arcanist, hextech, debonair, mutant, chemtech, assassin
const offensive_items = [11, 12, 17, 19, 22, 23, 24, 26, 29, 33, 34, 39, 46]
const defensive_items = [13, 15, 16, 49, 69, 79]
const mana_items = [14, 44]
const debuff_items = [37, 45, 57, 59, 67]
const tank_items = [25, 27, 35, 36, 47, 55, 56, 66, 77]
const one_cost_units = ["brand", "caitlyn", "camille", "darius", "caitlyn", "illaoi", "jarvaniv", "kassadin", "nocturne", "poppy", "singed", "twitch", "ziggs"]
const two_cost_units = ["ashe", "blitzcrank", "corki", "lulu", "quinn", "reksai", "sejuani", "swain", "syndra", "talon", "warwick", "zilean", "zyra"]
const three_cost_units = ["chogath", "ekko", "gangplank", "gnar", "leona", "lucian", "malzahar", "missfortune", "morgana", "senna", "tryndamere", "vex", "zac"]
const four_cost_units = ["ahri", "alistar", "braum", "draven", "irelia", "jhin", "khazix", "orianna", "renata", "seraphine", "sivir", "vi"]
const five_cost_units = ["galio", "jayce", "jinx", "kaisa", "silco", "tahmkench", "veigar", "viktor", "zeri"]
const emblem_or_trait_augments = ["ArcanistEmblem", "ArcanistEmblem2", "ArcanistTrait", "AssassinEmblem", "AssassinEmblem2", "AssassinTrait", "BruteEmblem", "BruteEmblem2", "BruteTrait", "ChallengerEmblem", "ChallengerEmblem2", "ChallengerTrait", "ChemtechEmblem", "ChemtechEmblem2", "ChemtechTrait", "ClockworkTrait", "ClockworkTrait2", "DebonairEmblem", "DebonairEmblem2", "DebonairTrait", "EnchanterTrait", "EnchanterTrait2", "EnforcerTrait", "ExperimentalEmblem", "ExperimentalEmblem2", "ExperimentalTrait", "HeroEmblem", "HeroEmblem2", "HeroTrait", "HextechEmblem", "HextechEmblem2", "HextechTrait", "InnovatorTrait", "MercenaryEmblem", "MercenaryTrait", "MercenaryTrait2", "ScholarEmblem", "ScholarTrait", "ScholarTrait2", "ScrapEmblem", "ScrapTrait", "ScrapTrait2", "SniperEmblem", "SniperEmblem2", "SniperTrait", "SocialiteTrait", "SocialiteTrait2", "StrikerEmblem", "StrikerEmblem2", "StrikerTrait", "SyndicateEmblem", "SyndicateEmblem2", "SyndicateTrait", "TomeOfTraits1", "TwinshotTrait", "TwinshotTrait2"]
const trait_combat_augments = ["ArcanistRunicShield1", "ArcanistRunicShield2", "ArcanistRunicShield3", "ArcanistSpellBlade", "AssassinCutthroat", "AssassinSmokeBomb", "BrawlerHPRegen1", "ChallengerEnGarde", "ChallengerForAllUnits", "ChemtechForAllUnits", "ChemtechInjection", "ChemtechOverload1", "ChemtechOverload2", "ClockworkBrokenStopwatch", "ColossusArmorPlating", "DebonairIrresistible", "DebonairVVIP", "EnchanterArdentCenser", "EnforcerSwiftJustice", "HeroStandBehindMe", "HextechForAllUnits", "HextechHexnova", "HextechStoredPower", "InnovatorSelfRepair", "MercenaryGoldReserves", "MercenaryPirates", "MutantUnstableEvolution", "ScholarLearning", "SniperNest", "SniperSharpshooter", "SocialiteDuet", "SocialiteShare", "StrikerConcussiveBlows", "StrikerOverpower", "SyndicateOneForAll", "YordleSoSmall"]
const combat_buff_augments = ["Archangel2", "Ascension", "BlueBattery1", "BlueBattery2", "Disintegrator1", "Disintegrator2", "Disintegrator3", "Electrocharge1", "Electrocharge2", "Electrocharge3", "Featherweights1", "Featherweights2", "Featherweights3", "JeweledLotus", "LudensEcho1", "LudensEcho2", "LudensEcho3", "TriForce1", "TriForce2", "TriForce3", "Twins1", "Twins2", "Twins3", "VerdantVeil", "Weakspot", "Weakspot2", "Weakspot3","Diversify1", "Diversify2", "Diversify3", "SunfireBoard", "TargetDummies", "TitanicForce", "Traitless1", "Traitless2", "Traitless3", "WoodlandCharm", "WoodlandTrinket"]
const positioning_combat_augments = ["Backfoot1", "Backfoot2", "Backfoot3", "Battlemage1", "Battlemage2", "Battlemage3", "Phalanx1", "Phalanx2", "Phalanx3", "Distancing", "Distancing2", "Distancing3", "Keepers1", "Keepers2", "MeleeStarBlade1", "MeleeStarBlade2", "MeleeStarBlade3"]
const combat_healing_augments = ["CelestialBlessing1", "CelestialBlessing2", "CelestialBlessing3", "FirstAidKit", "SecondWind1", "SecondWind2", "ThrillOfTheHunt1", "ThrillOfTheHunt2", "Underdogs"]
const item_providing_augments = ["BandOfThieves1", "BinaryAirdrop", "ComponentGrabBag", "ItemGrabBag1", "ItemGrabBag2", "PandorasItems", "PortableForge", "RadiantRelics", "SalvageBin", "FuturePeepers", "FuturePeepers2", "ScrapDumpsterDiving", "ThievingRascals"]
const econ_giving_augments = ["CalculatedLoss", "Dominance", "FourScore", "GachaAddict", "GoldenGifts1", "GoldenGifts2", "GrandGambler", "HighFive", "HyperRoll", "Recombobulator", "RichGetRicher", "TheGoldenEgg", "ThreesCompany", "TradeSector", "TreasureTrove1", "TreasureTrove2", "TreasureTrove3", "TrueTwos", "Windfall", "SyndicatePayday"]
const levelling_augments = ["ClearMind", "MaxLevel10", "SlowAndSteady", "ThriftShop", "ForceOfNature", "HighEndShopping"]
const cyber_augments = ["CyberneticImplants1", "CyberneticImplants2", "CyberneticImplants3", "CyberneticShell1", "CyberneticShell2", "CyberneticShell3", "CyberneticUplink1", "CyberneticUplink2", "CyberneticUplink3"]
const no_item_augments = ["MakeshiftArmor1", "MakeshiftArmor2", "MakeshiftArmor3", "Meditation1", "Meditation2", "Meditation3"]
const actual_health_boost_augments = ["MetabolicAccelerator", "TinyTitans"]

// const damage_units = ["brand", "caitlyn", "caitlyn", "twitch", "ziggs", "ashe", "corki", "talon", "warwick", "gangplank", "lucian", "malzahar", "missfortune", "tryndamere", "ahri", "draven", "irelia", "jhin", "khazix", "sivir",  "jinx", "kaisa", "veigar", "viktor", "zeri"]
// const support_units = ["jarvaniv", "nocturne", "lulu", "quinn", "syndra", "zilean", "zyra", "ekko", "senna", "seraphine", "renata", "silco"]
// const tank_units = ["camille", "darius", "illaoi", "poppy", "singed", "blitzcrank", "reksai", "sejuani", "swain", "chogath", "gnar", "leona", "morgana", "vex", "zac", "alistar", "braum", "vi", "galio", "tahmkench"]
// const unplaced_units = ["jayce"]

// gacha addict is loaded dice OR golden ticket, assuming slow and steady is march of progress, wise spending is probably thrift shop
// distancing is exiles, diversify is stand united, FON is new recruit (+1 prismatic), future peepers = future sight, high end shopping, keepers, meleeblade is knife's edge

function break_down_items(player) {
  let all_items = []
  for (let unit of player.units) { // go through units to get items
    for (let item of unit.items) {
      all_items.push(item)
    }
  }
  // item ids: 1: sword, 2: bow, 3: rod, 4: tear, 5: chain, 6: cloak, 7: belt, 8: spat, 9: glove
  let components = {sword: 0, bow: 0, rod: 0, tear: 0, chain: 0, cloak: 0, belt: 0, spat: 0, glove: 0, radiant: 0, ornn: 0, emblem: 0, fon: 0}
  for (let item of all_items) {
    if (spat_items.includes(item)) { // spat items are emblems
      components.emblem += 1;
    } else if (item == 88) { // two spats is a fon, special item
      components.fon += 1;
    } else if (item > 0 && item < 100) { // all these are normal items
      let digits = item.toString().split("") // the id of the items is made up of the two components
      for (let digit of digits) { // going through the digits to get the components
        if (digit == "1") {
          components.sword += 1;
        } else if (digit == "2") {
          components.bow += 1;
        } else if (digit == "3") {
          components.rod += 1;
        } else if (digit == "4") {
          components.tear += 1;
        } else if (digit == "5") {
          components.chain += 1;
        } else if (digit == "6") {
          components.cloak += 1;
        } else if (digit == "7") {
          components.belt += 1;
        } else if (digit == "8") {
          components.spat += 1;
        } else if (digit == "9") {
          components.glove += 1;
        } 
      }
    } else if (item > 2000 && item < 2100) { // radiant items
      components.radiant += 1;
    } else if (item >= 9001 && item <= 9010) { // ornn items
      components.ornn += 1;
    } else if (item >= 2190 && item <= 2200) { // emblems
      components.emblem += 1;
    }
  }
  return components;
}

function summarize_items(player) {
  let all_items = []
  for (let unit of player.units) { // go through units to get items
    for (let item of unit.items) {
      all_items.push(item)
    }
  }

  let items = { offensive_items: 0, defensive_items: 0, mana_items: 0, debuff_items: 0, tank_items: 0, thieves_gloves: 0, components: 0 }

  for (let item of all_items) {
    if (offensive_items.includes(item)) {
      items.offensive_items += 1;
    } else if (defensive_items.includes(item)) {
      items.defensive_items += 1;
    } else if (mana_items.includes(item)) {
      items.mana_items += 1;
    } else if (debuff_items.includes(item)) {
      items.debuff_items += 1;
    } else if (tank_items.includes(item)) {
      items.tank_items += 1;
    } else if (item == 99) {
      items.thieves_gloves += 1;
    } else if (item >= 1 && item <= 9) {
      items.components += 1;
    }
  }

  return items;
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

function compile_units(player) {
  let units = {"1*_1cost_itemized": 0, "2*_1cost_itemized": 0, "3*_1cost_itemized": 0, "1*_1cost_unitemized": 0, "2*_1cost_unitemized": 0, "3*_1cost_unitemized": 0,
    "1*_2cost_itemized": 0, "2*_2cost_itemized": 0, "3*_2cost_itemized": 0, "1*_2cost_unitemized": 0, "2*_2cost_unitemized": 0, "3*_2cost_unitemized": 0,
    "1*_3cost_itemized": 0, "2*_3cost_itemized": 0, "3*_3cost_itemized": 0, "1*_3cost_unitemized": 0, "2*_3cost_unitemized": 0, "3*_3cost_unitemized": 0,
    "1*_4cost_itemized": 0, "2*_4cost_itemized": 0, "3*_4cost_itemized": 0, "1*_4cost_unitemized": 0, "2*_4cost_unitemized": 0, "3*_4cost_unitemized": 0, 
    "1*_5cost_itemized": 0, "2*_5cost_itemized": 0, "3*_5cost_itemized": 0, "1*_5cost_unitemized": 0, "2*_5cost_unitemized": 0, "3*_5cost_unitemized": 0}
  
  for (let unit of player.units) {
    let name = unit.character_id.toLowerCase().substring(5) // first 5 chars are "Set6_"
    if (one_cost_units.includes(name)) { // 1 cost units
      if (unit.tier == 1) {
        if (unit.items.length >= 2) {
          units["1*_1cost_itemized"] += 1
        } else {
          units["1*_1cost_unitemized"] += 1
        }
      } else if (unit.tier == 2) {
        if (unit.items.length >= 2) {
          units["2*_1cost_itemized"] += 1
        } else {
          units["2*_1cost_unitemized"] += 1
        }
      } else {
        if (unit.items.length >= 2) {
          units["3*_1cost_itemized"] += 1
        } else {
          units["3*_1cost_unitemized"] += 1
        }
      }
    } else if (two_cost_units.includes(name)) { // 2 cost units
      if (unit.tier == 1) {
        if (unit.items.length >= 2) {
          units["1*_2cost_itemized"] += 1
        } else {
          units["1*_2cost_unitemized"] += 1
        }
      } else if (unit.tier == 2) {
        if (unit.items.length >= 2) {
          units["2*_2cost_itemized"] += 1
        } else {
          units["2*_2cost_unitemized"] += 1
        }
      } else {
        if (unit.items.length >= 2) {
          units["3*_2cost_itemized"] += 1
        } else {
          units["3*_2cost_unitemized"] += 1
        }
      }
    } else if (three_cost_units.includes(name)) { // 3 cost units
      if (unit.tier == 1) {
        if (unit.items.length >= 2) {
          units["1*_3cost_itemized"] += 1
        } else {
          units["1*_3cost_unitemized"] += 1
        }
      } else if (unit.tier == 2) {
        if (unit.items.length >= 2) {
          units["2*_3cost_itemized"] += 1
        } else {
          units["2*_3cost_unitemized"] += 1
        }
      } else {
        if (unit.items.length >= 2) {
          units["3*_3cost_itemized"] += 1
        } else {
          units["3*_3cost_unitemized"] += 1
        }
      }
    } else if (four_cost_units.includes(name)) { // 4 cost units
      if (unit.tier == 1) {
        if (unit.items.length >= 2) {
          units["1*_4cost_itemized"] += 1
        } else {
          units["1*_4cost_unitemized"] += 1
        }
      } else if (unit.tier == 2) {
        if (unit.items.length >= 2) {
          units["2*_4cost_itemized"] += 1
        } else {
          units["2*_4cost_unitemized"] += 1
        }
      } else {
        if (unit.items.length >= 2) {
          units["3*_4cost_itemized"] += 1
        } else {
          units["3*_4cost_unitemized"] += 1
        }
      }
    } else if (five_cost_units.includes(name)) { // 5 cost units
      if (unit.tier == 1) {
        if (unit.items.length >= 2) {
          units["1*_5cost_itemized"] += 1
        } else {
          units["1*_5cost_unitemized"] += 1
        }
      } else if (unit.tier == 2) {
        if (unit.items.length >= 2) {
          units["2*_5cost_itemized"] += 1
        } else {
          units["2*_5cost_unitemized"] += 1
        }
      } else {
        if (unit.items.length >= 2) {
          units["3*_5cost_itemized"] += 1
        } else {
          units["3*_5cost_unitemized"] += 1
        }
      }
    }
  }
  return units;
}

function compile_augments(player) {
  let augments = { emblem_or_trait_augments: 0, trait_combat_augments: 0, 
    combat_buff_augments: 0, positioning_combat_augments: 0, combat_healing_augments: 0, 
    item_providing_augments: 0, levelling_augments: 0, actual_health_boost_augments: 0, econ_giving_augments: 0 }

  for (let augment of player.augments) {
    let tempAug = augment.substring(13)
    if (emblem_or_trait_augments.includes(tempAug)) {
      augments.emblem_or_trait_augments += 1;
    } else if (trait_combat_augments.includes(tempAug)) {
      augments.trait_combat_augments += 1;
    } else if (combat_buff_augments.includes(tempAug) || cyber_augments.includes(tempAug) || no_item_augments.includes(tempAug)) {
      augments.combat_buff_augments += 1;
    } else if (positioning_combat_augments.includes(tempAug)) {
      augments.positioning_combat_augments += 1;
    } else if (combat_healing_augments.includes(tempAug)) {
      augments.combat_healing_augments += 1;
    } else if (item_providing_augments.includes(tempAug)) {
      augments.item_providing_augments += 1;
    } else if (levelling_augments.includes(tempAug)) {
      augments.levelling_augments += 1;
    } else if (actual_health_boost_augments.includes(tempAug)) {
      augments.actual_health_boost_augments += 1;
    } else if (econ_giving_augments.includes(tempAug)) {
      augments.econ_giving_augments += 1;
    } 
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
      ...break_down_items(player),
      ...summarize_items(player),
      ...compile_traits(player),
      ...compile_units(player),
      ...compile_augments(player)
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
  fs.writeFile(`./finalData/${region}_data.json`, jsonData, 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }});
}

// let player = require('./sample_player.json');
// let stats = {
//   ...break_down_items(player),
//   ...compile_traits(player),
//   ...compile_units(player)
// }
// console.log(compile_augments(player))

for (let region of regions) {
  file_to_games(region);
}