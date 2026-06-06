const fs = require('fs');

const rawText = `
11 Haziran Perşembe – 22:00: Meksika – Güney Afrika (A Grubu)
12 Haziran Cuma – 05:00: Güney Kore – Çek Cumhuriyeti (A Grubu)
12 Haziran Cuma – 22:00: Kanada – Bosna Hersek (B Grubu)
13 Haziran Cumartesi – 04:00: ABD – Paraguay (D Grubu)
13 Haziran Cumartesi – 22:00: Katar – İsviçre (B Grubu)
14 Haziran Pazar – 01:00: Brezilya – Fas (C Grubu)
14 Haziran Pazar – 04:00: Haiti – İskoçya (C Grubu)
14 Haziran Pazar – 07:00: Avustralya – Türkiye (D Grubu)
14 Haziran Pazar – 20:00: Almanya – Curaçao (E Grubu)
14 Haziran Pazar – 23:00: Hollanda – Japonya (F Grubu)
15 Haziran Pazartesi – 02:00: Fildişi Sahili – Ekvador (E Grubu)
15 Haziran Pazartesi – 05:00: İsveç – Tunus (F Grubu)
15 Haziran Pazartesi – 19:00: İspanya – Yeşil Burun Adaları (H Grubu)
15 Haziran Pazartesi – 22:00: Belçika – Mısır (G Grubu)
16 Haziran Salı – 01:00: Suudi Arabistan – Uruguay (H Grubu)
16 Haziran Salı – 04:00: İran – Yeni Zelanda (G Grubu)
16 Haziran Salı – 22:00: Fransa – Senegal (I Grubu)
17 Haziran Çarşamba – 01:00: Irak – Norveç (I Grubu)
17 Haziran Çarşamba – 04:00: Arjantin – Cezayir (J Grubu)
17 Haziran Çarşamba – 07:00: Avusturya – Ürdün (J Grubu)
17 Haziran Çarşamba – 20:00: Portekiz – Demokratik Kongo Cumhuriyeti (K Grubu)
17 Haziran Çarşamba – 23:00: İngiltere – Hırvatistan (L Grubu)
18 Haziran Perşembe – 02:00: Gana – Panama (L Grubu)
18 Haziran Perşembe – 05:00: Özbekistan – Kolombiya (K Grubu)
18 Haziran Perşembe – 19:00: Çek Cumhuriyeti – Güney Afrika (A Grubu)
18 Haziran Perşembe – 22:00: Bosna Hersek – İsviçre (B Grubu)
19 Haziran Cuma – 01:00: Kanada – Katar (B Grubu)
19 Haziran Cuma – 04:00: Meksika – Güney Kore (A Grubu)
19 Haziran Cuma – 22:00: ABD – Avustralya (D Grubu)
20 Haziran Cumartesi – 01:00: İskoçya – Fas (C Grubu)
20 Haziran Cumartesi – 03:30: Brezilya – Haiti (C Grubu)
20 Haziran Cumartesi – 06:00: Türkiye – Paraguay (D Grubu)
20 Haziran Cumartesi – 20:00: Hollanda – İsveç (F Grubu)
20 Haziran Cumartesi – 23:00: Almanya – Fildişi Sahili (E Grubu)
21 Haziran Pazar – 03:00: Ekvador – Curaçao (E Grubu)
21 Haziran Pazar – 07:00: Tunus – Japonya (F Grubu)
21 Haziran Pazar – 19:00: İspanya – Suudi Arabistan (H Grubu)
21 Haziran Pazar – 22:00: Belçika – İran (G Grubu)
22 Haziran Pazartesi – 01:00: Uruguay – Yeşil Burun Adaları (H Grubu)
22 Haziran Pazartesi – 04:00: Yeni Zelanda – Mısır (G Grubu)
22 Haziran Pazartesi – 19:00: Fransa – Irak (I Grubu)
22 Haziran Pazartesi – 22:00: Norveç – Senegal (I Grubu)
23 Haziran Salı – 01:00: Arjantin – Avusturya (J Grubu)
23 Haziran Salı – 04:00: Ürdün – Cezayir (J Grubu)
23 Haziran Salı – 19:00: Portekiz – Özbekistan (K Grubu)
23 Haziran Salı – 22:00: Kolombiya – Demokratik Kongo Cumhuriyeti (K Grubu)
24 Haziran Çarşamba – 01:00: İngiltere – Gana (L Grubu)
24 Haziran Çarşamba – 04:00: Panama – Hırvatistan (L Grubu)
24 Haziran Çarşamba – 23:00: Meksika – Çek Cumhuriyeti (A Grubu)
24 Haziran Çarşamba – 23:00: Güney Afrika – Güney Kore (A Grubu)
25 Haziran Perşembe – 03:00: Kanada – İsviçre (B Grubu)
25 Haziran Perşembe – 03:00: Bosna Hersek – Katar (B Grubu)
25 Haziran Perşembe – 23:00: Brezilya – İskoçya (C Grubu)
25 Haziran Perşembe – 23:00: Fas – Haiti (C Grubu)
26 Haziran Cuma – 03:00: Türkiye – ABD (D Grubu)
26 Haziran Cuma – 03:00: Paraguay – Avustralya (D Grubu)
26 Haziran Cuma – 23:00: Almanya – Ekvador (E Grubu)
26 Haziran Cuma – 23:00: Curaçao – Fildişi Sahili (E Grubu)
27 Haziran Cumartesi – 03:00: Hollanda – Tunus (F Grubu)
27 Haziran Cumartesi – 03:00: Japonya – İsveç (F Grubu)
27 Haziran Cumartesi – 22:00: Belçika – Yeni Zelanda (G Grubu)
27 Haziran Cumartesi – 22:00: Mısır – İran (G Grubu)
28 Haziran Pazar – 01:00: İspanya – Uruguay (H Grubu)
28 Haziran Pazar – 01:00: Yeşil Burun Adaları – Suudi Arabistan (H Grubu)
28 Haziran Pazar – 22:00: Fransa – Norveç (I Grubu)
28 Haziran Pazar – 22:00: Senegal – Irak (I Grubu)
29 Haziran Pazartesi – 01:00: Arjantin – Ürdün (J Grubu)
29 Haziran Pazartesi – 01:00: Cezayir – Avusturya (J Grubu)
29 Haziran Pazartesi – 22:00: Portekiz – Kolombiya (K Grubu)
29 Haziran Pazartesi – 22:00: Demokratik Kongo Cumhuriyeti – Özbekistan (K Grubu)
30 Haziran Salı – 01:00: İngiltere – Panama (L Grubu)
30 Haziran Salı – 01:00: Hırvatistan – Gana (L Grubu)
28 Haziran Pazar – 23:00: Maç 73 (Los Angeles)
29 Haziran Pazartesi – 03:00: Maç 74 (Dallas)
29 Haziran Pazartesi – 22:00: Maç 75 (Boston)
30 Haziran Salı – 01:00: Maç 76 (Atlanta)
30 Haziran Salı – 04:00: Maç 77 (San Francisco)
30 Haziran Salı – 22:00: Maç 78 (New York New Jersey)
1 Temmuz Çarşamba – 01:00: Maç 79 (Houston)
1 Temmuz Çarşamba – 04:00: Maç 80 (Monterrey)
1 Temmuz Çarşamba – 22:00: Maç 81 (Orlando)
2 Temmuz Perşembe – 01:00: Maç 82 (Miami)
2 Temmuz Perşembe – 04:00: Maç 83 (Mexico City)
2 Temmuz Perşembe – 22:00: Maç 84 (Vancouver)
3 Temmuz Cuma – 01:00: Maç 85 (Kansas City)
3 Temmuz Cuma – 04:00: Maç 86 (Seattle)
3 Temmuz Cuma – 22:00: Maç 87 (Toronto)
4 Temmuz Cumartesi – 01:00: Maç 88 (Philadelphia)
4 Temmuz Cumartesi – 23:00: Maç 89 (Houston)
5 Temmuz Pazar – 03:00: Maç 90 (New York New Jersey)
5 Temmuz Pazar – 23:00: Maç 91 (Philadelphia)
6 Temmuz Pazartesi – 03:00: Maç 92 (Mexico City)
6 Temmuz Pazartesi – 22:00: Maç 93 (Seattle)
7 Salı – 01:00: Maç 94 (Vancouver)
7 Salı – 22:00: Maç 95 (Atlanta)
8 Çarşamba – 01:00: Maç 96 (Boston)
10 Temmuz Cuma – 22:00: Çeyrek Final 1 (Boston)
11 Temmuz Cumartesi – 01:00: Çeyrek Final 2 (Los Angeles)
11 Temmuz Cumartesi – 22:00: Çeyrek Final 3 (Miami)
12 Temmuz Pazar – 01:00: Çeyrek Final 4 (Kansas City)
15 Temmuz Çarşamba – 03:00: 1. Yarı Final (Dallas - AT&T Stadyumu)
16 Temmuz Perşembe – 03:00: 2. Yarı Final (Atlanta - Mercedes-Benz Stadyumu)
18 Temmuz Cumartesi – 23:00: Üçüncülük / Bronz Madalya Maçı (Miami - Hard Rock Stadyumu)
19 Temmuz Pazar – 23:00: Dünya Kupası Final Maçı (New York New Jersey - MetLife Stadyumu)
`;

const monthMap = {
    'Haziran': '06',
    'Temmuz': '07'
};

const flags = {
    'Meksika': '🇲🇽', 'Güney Afrika': '🇿🇦', 'Güney Kore': '🇰🇷', 'Çek Cumhuriyeti': '🇨🇿',
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

let matchIdCounter = 1;
const matches = [];

const lines = rawText.split('\n').filter(l => l.trim().length > 0);

lines.forEach(line => {
    // 11 Haziran Perşembe – 22:00: Meksika – Güney Afrika (A Grubu)
    // 7 Salı – 01:00: Maç 94 (Vancouver)
    const match = line.match(/^(\d+)\s+(.+?)\s*–\s*(\d{2}:\d{2}):\s*(.+)$/);
    if (!match) {
        console.log("Failed to parse:", line);
        return;
    }
    
    let day = match[1].padStart(2, '0');
    let dateWords = match[2].trim().split(' ');
    let monthName;
    
    // dateWords might be ["Haziran", "Perşembe"] or ["Temmuz", "2026", "Pazar"] or ["Salı"]
    if (dateWords.length === 1) {
        monthName = dateWords[0];
    } else {
        monthName = dateWords[0]; 
    }
    
    if (!monthMap[monthName]) {
        // e.g. if it's "Salı"
        if (['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].includes(monthName)) {
            // It's a day of week, so month is probably Temmuz (July) since group stages end June 30
            monthName = 'Temmuz';
        }
    }
    let time = match[3];
    let details = match[4];
    
    let month = monthMap[monthName] || '07';
    
    // Construct ISO string in UTC+3
    let dateIso = "2026-" + month + "-" + day + "T" + time + ":00+03:00";
    
    // Parse Details
    let team1 = "Belirsiz", team2 = "Belirsiz", group = "Son Tur", stadium = "Belirsiz";
    
    if (details.includes('Grubu)')) {
        // Group matches
        const groupMatch = details.match(/(.+) – (.+) \((.+) Grubu\)/);
        if (groupMatch) {
            team1 = groupMatch[1].trim();
            team2 = groupMatch[2].trim();
            group = groupMatch[3].trim() + " Grubu";
        }
    } else {
        // Knockouts
        const knockoutMatch = details.match(/(.+) \((.+)\)/);
        if (knockoutMatch) {
            team1 = knockoutMatch[1].trim();
            group = "Eliminasyon";
            stadium = knockoutMatch[2].trim();
        } else {
            team1 = details.trim();
        }
    }
    
    matches.push({
        id: "m" + matchIdCounter++,
        date_utc: new Date(dateIso).toISOString(),
        team1: { name: team1, flag: getFlag(team1) },
        team2: { name: team2, flag: getFlag(team2) },
        group: group,
        stadium: stadium !== "Belirsiz" ? stadium : "FIFA Stadyumu",
        broadcaster: "TRT Spor" // Default fallback until spider works
    });
});

fs.writeFileSync('data.json', JSON.stringify({ matches }, null, 4));
console.log("Successfully generated data.json with " + matches.length + " matches.");
