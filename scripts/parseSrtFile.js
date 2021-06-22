/**
 * parseSrtFile.js
 * @author Sam Lynch
 * @description This node script simply runs `subtitles-parser` against a `.srt file` to produce meemr-compatible JSON
*/

const srt = require("subtitles-parser");
const fs = require("fs");
const args = process.argv.slice(2);

if(args.length < 1) {
    console.log("node parseSrtFile.js [path to srt file]")
    return;
}

const file = fs.readFileSync(args[0], "utf8");
const subtitleJson = srt.fromSrt(file, true);
const subtitleJsonStringified = JSON.stringify(subtitleJson, undefined, " ");

fs.writeFileSync(`${args[0]}.json`, subtitleJsonStringified, "utf8");
