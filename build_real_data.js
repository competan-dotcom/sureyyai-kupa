const fs = require('fs');

const path = 'C:\\\\Users\\\\tubabilgin\\\\.gemini\\\\antigravity\\\\brain\\\\5177e5d5-65c8-4f96-81ca-34d74857ddc4\\\\.system_generated\\\\steps\\\\481\\\\content.md';
const content = fs.readFileSync(path, 'utf8');

const match = content.match(/<script type="application\/ld\+json" data-qmeta="eventListRichResult">(.+?)<\/script>/);

if (match && match[1]) {
    const events = JSON.parse(match[1]);
    console.log(`Found ${events.length} events in the JSON.`);

    const matches = [];
    const flags = {
        'Meksika': '🇲🇽', 'Güney Afrika': '🇿🇦', 'Güney Kore': '🇰🇷', 'Çekya': '🇨🇿', 'Çek Cumhuriyeti': '🇨🇿',
        'Kanada': '🇨🇦', 'Bosna Hersek': '🇧🇦', 'ABD': '🇺🇸', 'Paraguay': '🇵🇾',
        'Katar': '🇶🇦', 'İsviçre': '🇨🇭', 'Brezilya': '🇧🇷', 'Fas': '🇲🇦',
        'Haiti': '🇭🇹', 'İskoçya': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Avustralya': '🇦🇺', 'Türkiye': '🇹🇷',
        'Almanya': '🇩🇪', 'Curaçao': '🇨🇼', 'Hollanda': '🇳🇱', 'Japonya': '🇯🇵',
        'Fildişi Sahili': '🇨🇮', 'Ekvador': '🇪🇨', 'İsveç': '🇸🇪', 'Tunus': '🇹🇳',
        'İspanya': '🇪🇸', 'Yeşil Burun Adaları': '🇨🇻', 'Belçika': '🇧🇪', 'Mısır': '🇪🇬',
        'Suudi Arabistan': '🇸🇦', 'Uruguay': '🇺🇾', 'İran': '🇮🇷', 'Yeni Zelanda': '🇳🇿',
        'Fransa': '🇫🇷', 'Senegal': '🇸🇳', 'Irak': '🇮🇶', 'Norveç': '🇳🇴',
        'Arjantin': '🇦🇷', 'Cezayir': '🇩🇿', 'Avusturya': '🇦🇹', 'Ürdün': '🇯🇴',
        'Portekiz': '🇵🇹', 'Demokratik Kongo Cumhuriyeti': '🇨🇩', 'İngiltere': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Hırvatistan': '🇭🇷', 'Gana': '🇬🇭', 'Panama': '🇵🇦', 'Özbekistan': '🇺🇿', 'Kolombiya': '🇨🇴'
    };
    const getFlag = (name) => flags[name] || '🌍';

    events.forEach((ev, idx) => {
        const be = ev.broadcastOfEvent;
        const channel = ev.broadcastChannel.name;
        const startDate = be.startDate;
        
        let stadium = be.location ? be.location.name : "Belirsiz Stadyum";
        let city = be.location && be.location.address ? be.location.address.addressLocality : "";
        if (city) stadium += ", " + city;
        
        // Basic mapping for USA/MEX/CAN based on city
        let country = "ABD";
        if (["Mexico City", "Zapopan", "Monterrey", "Guadalajara"].includes(city)) country = "Meksika";
        if (["Toronto", "Vancouver"].includes(city)) country = "Kanada";
        
        if (stadium !== "Belirsiz Stadyum") {
            stadium = stadium.replace(' Stadyumu', ''); // clean up
            stadium += ", " + country;
        }

        let team1 = be.homeTeam ? be.homeTeam.name : "";
        let team2 = be.awayTeam ? be.awayTeam.name : "";
        let matchName = be.name;
        
        if (!team1 && matchName.includes('-')) {
            const parts = matchName.split('-');
            team1 = parts[0].trim();
            team2 = parts[1].trim();
        }

        if (!team1) team1 = matchName;
        if (!team2) team2 = "TBD";

        // Let's determine Group by searching our old data if needed, or assume it from the name
        // The scraping data doesn't have "A Grubu". It just says "Meksika - Güney Afrika".
        let group = "Grup Maçı";
        
        // Set mock score for first 3
        let score = null;
        let status = null;
        if (idx < 3) {
            score = Math.floor(Math.random() * 3) + " - " + Math.floor(Math.random() * 3);
            status = "finished";
        }

        matches.push({
            id: "m" + (idx + 1),
            date_utc: startDate,
            team1: { name: team1, flag: getFlag(team1) },
            team2: { name: team2, flag: getFlag(team2) },
            group: group,
            stadium: stadium,
            broadcaster: channel,
            score: score,
            status: status
        });
    });

    fs.writeFileSync('data.json', JSON.stringify({ matches }, null, 4));
    console.log("Successfully rebuilt data.json from sporekrani JSON-LD.");
} else {
    console.log("Could not parse JSON-LD from content.md");
}
