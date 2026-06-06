const fs = require('fs');

const pathScraped = 'C:\\\\Users\\\\tubabilgin\\\\.gemini\\\\antigravity\\\\brain\\\\5177e5d5-65c8-4f96-81ca-34d74857ddc4\\\\.system_generated\\\\steps\\\\481\\\\content.md';
const content = fs.readFileSync(pathScraped, 'utf8');
const match = content.match(/<script type="application\/ld\+json" data-qmeta="eventListRichResult">(.+?)<\/script>/);

const dataJson = JSON.parse(fs.readFileSync('data.json', 'utf8'));

if (match && match[1]) {
    const events = JSON.parse(match[1]);
    
    // Create lookup by team names
    const eventLookup = {};
    events.forEach(ev => {
        const be = ev.broadcastOfEvent;
        const channel = ev.broadcastChannel.name;
        
        let stadium = be.location ? be.location.name : "";
        let city = be.location && be.location.address ? be.location.address.addressLocality : "";
        if (city) stadium += ", " + city;
        
        let country = "ABD";
        if (["Mexico City", "Zapopan", "Monterrey", "Guadalajara"].includes(city)) country = "Meksika";
        if (["Toronto", "Vancouver"].includes(city)) country = "Kanada";
        
        if (stadium) {
            stadium = stadium.replace(' Stadyumu', '');
            stadium += ", " + country;
        }

        let t1 = be.homeTeam ? be.homeTeam.name : "";
        let t2 = be.awayTeam ? be.awayTeam.name : "";
        let mn = be.name;
        if (!t1 && mn.includes('-')) {
            const pts = mn.split('-');
            t1 = pts[0].trim();
            t2 = pts[1].trim();
        }

        // key
        const key = t1.toLowerCase() + "-" + t2.toLowerCase();
        eventLookup[key] = { stadium, channel };
    });

    // Merge into data.json
    let mergedCount = 0;
    dataJson.matches.forEach(m => {
        const t1 = m.team1.name.toLowerCase();
        const t2 = m.team2.name.toLowerCase();
        
        // Exact match
        let found = eventLookup[t1 + "-" + t2] || eventLookup[t2 + "-" + t1];
        
        if (found) {
            m.stadium = found.stadium || m.stadium;
            m.broadcaster = found.channel || "TRT Spor"; // Sporekrani sets this precisely
            mergedCount++;
        } else {
            // For knockout matches not in sporekrani's 72 list, set default broadcaster
            if (m.broadcaster.includes("TOD") || m.broadcaster === "Yayıncı Bekleniyor") {
                m.broadcaster = "TRT 1";
            }
        }
    });

    fs.writeFileSync('data.json', JSON.stringify(dataJson, null, 4));
    console.log("Successfully merged data! Updated " + mergedCount + " matches with accurate stadiums and TV channels.");
} else {
    console.log("Could not parse JSON-LD");
}
