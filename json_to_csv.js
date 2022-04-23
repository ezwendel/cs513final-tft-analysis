const { Parser } = require('json2csv');
const fs = require('fs')
let rawData = fs.readFileSync(`./finalData/all_data.json`)
let allData = JSON.parse(rawData)
const fields = Object.keys(allData[0])
// console.log(fields)


const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(allData);

fs.writeFile(`./finalData/all_data.csv`, csv, 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});
  