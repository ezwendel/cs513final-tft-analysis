const fs = require('fs')

const all_augments = JSON.parse(fs.readFileSync(`./all_augments.json`,'utf8'))
const all_items = JSON.parse(fs.readFileSync(`./all_items.json`,'utf8'))
const all_champs = JSON.parse(fs.readFileSync(`./all_champs.json`,'utf8'))
const all_traits = {arcanist: 0, assassin: 0, bodyguard: 0, bruiser: 0, challenger: 0, colossus: 0, enchanter: 0, innovator: 0, mastermind: 0, scholar: 0, sniper: 0, 
  transformer: 0, twinshot: 0, chemtech: 0, clockwork: 0, debonair: 0, enforcer: 0, glutton: 0, hextech: 0, mercenary: 0, mutant: 0, rivals: 0, scrap: 0, 
  socialite: 0, striker: 0, syndicate: 0, yordle: 0, yordlelord: 0}

console.log(`All augments: ${Object.keys(all_augments).length}`)
console.log(`All items: ${Object.keys(all_items).length}`)
console.log(`All champs: ${Object.keys(all_champs).length}`)
console.log(`All traits: ${Object.keys(all_traits).length}`)

