const fs = require('fs');

const stadiumToCountry = {
    "Los Angeles": "ABD",
    "Dallas": "ABD",
    "Boston": "ABD",
    "Atlanta": "ABD",
    "San Francisco": "ABD",
    "New York New Jersey": "ABD",
    "Houston": "ABD",
    "Monterrey": "Meksika",
    "Orlando": "ABD",
    "Miami": "ABD",
    "Mexico City": "Meksika",
    "Vancouver": "Kanada",
    "Kansas City": "ABD",
    "Seattle": "ABD",
    "Toronto": "Kanada",
    "Philadelphia": "ABD",
    "AT&T Stadyumu": "ABD",
    "Mercedes-Benz Stadyumu": "ABD",
    "Hard Rock Stadyumu": "ABD",
    "MetLife Stadyumu": "ABD"
};

let rawData = fs.readFileSync('data.json', 'utf8');
let data = JSON.parse(rawData);

data.matches.forEach((match, index) => {
    // Determine Country
    let country = "";
    Object.keys(stadiumToCountry).forEach(key => {
        if (match.stadium.includes(key)) {
            country = stadiumToCountry[key];
        }
    });
    
    // Default country fallback for generic stadiums in USA for 2026
    if (!country) country = "ABD";

    if (!match.stadium.includes(country)) {
        match.stadium = `${match.stadium}, ${country}`;
    }

    // Add dummy scores to first 4 matches for testing
    if (index < 4) {
        match.score = `${Math.floor(Math.random() * 3)} - ${Math.floor(Math.random() * 3)}`;
        match.status = "finished";
    }
});

fs.writeFileSync('data.json', JSON.stringify(data, null, 4));
console.log("data.json updated successfully with countries and dummy scores.");
