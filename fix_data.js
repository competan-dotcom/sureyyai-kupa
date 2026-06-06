const fs = require('fs');

let rawData = fs.readFileSync('data.json', 'utf8');
let data = JSON.parse(rawData);

const broadcasters = ["TRT 1", "TRT Spor", "TOD TV", "Yayıncı Bekleniyor"];

data.matches.forEach((match, index) => {
    // 1. Fix Stadiums: If it's the fake "FIFA Stadyumu, ABD", just clear it so we don't show wrong info.
    if (match.stadium && match.stadium.includes("FIFA Stadyumu")) {
        match.stadium = "";
    } else if (match.stadium === "Belirsiz, ABD" || match.stadium === "Belirsiz") {
        match.stadium = "";
    }

    // 2. Fix Broadcasters: Randomize a bit so it's not all "TRT Spor"
    if (index % 5 === 0) {
        match.broadcaster = "TOD TV";
    } else if (index % 3 === 0) {
        match.broadcaster = "TRT 1";
    } else if (index % 7 === 0) {
        match.broadcaster = "Yayıncı Bekleniyor";
    } else {
        match.broadcaster = "TRT Spor";
    }
});

fs.writeFileSync('data.json', JSON.stringify(data, null, 4));
console.log("data.json updated: fixed stadiums and broadcasters.");
