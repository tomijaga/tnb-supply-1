import { readCsv, writeCsv } from "../utils/csv.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//convert all the csv files to json
convert()


async function convert() {
  const filePath = path.join(__dirname, "./csv/stats.csv")
  let file = await readCsv(filePath);

  const result = file.map(formatToJson)

  result.sort(({date: date_a}, {date: date_b})=> new Date(date_a) - new Date(date_b))

  fs.writeFile(path.join(__dirname, "./json/stats.json"), JSON.stringify(result), console.log)
}

function formatToJson(data) {
  const getValue = (key) => {
    const num = Number(data[key])
    if (num >= 0) return num

    return data[key]
  }
  const obj = {};
  Object.keys(data).forEach((rawKey) => {
    const key = rawKey.toLowerCase().replace(/ /g, "_");
    const key_words = key.split("_");

    if (key_words.length > 1) {
      if (key_words[0].startsWith("top") && key_words[1].endsWith("%")) {
        const subkey = key_words[2].concat("_percent")
        if (!obj[subkey]) obj[subkey] = {}
        obj[subkey]["top_".concat(key_words[1].slice(0, -1))] = getValue(rawKey)
      }
    }
    else if (key === "date") {
      let date = getValue(rawKey).replace(/_/g, ":")
      date = date.slice(0, 10) + "T" + date.slice(11)
      obj[key] = date
    } else {
      obj[key] = getValue(rawKey)
    }

  })
  return obj
}