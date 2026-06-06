document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Date Header Logic
    const dateHeader = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Istanbul' };
    const today = new Date();
    dateHeader.textContent = today.toLocaleDateString('tr-TR', options);

    // Fetch and Render Data
    fetchData();
});

async function fetchData() {
    try {
        // 1. Ağ: Kusursuz Ana Fikstür İskeletini Alıyoruz
        let baseData;
        try {
            const response = await fetch('data.json');
            baseData = await response.json();
        } catch(e) {
            console.error("Ana iskelet okunamadı", e);
            document.getElementById('today-matches').innerHTML = '<div class="no-matches">Sistem geçici olarak ulaşılamıyor.</div>';
            return;
        }

        // KULLANICIYI BEKLETMEMEK İÇİN ANA VERİYİ HEMEN EKRANA BASIYORUZ!
        processMatches(baseData.matches);

        // 2. Örümcek Ağı: Arka planda sessizce çalışır, ekranı dondurmaz.
        scrapeTurkishBroadcasters().then(channelsData => {
            if (channelsData && channelsData.length > 0) {
                // 3. Akıllı Birleştirme (Smart Merge)
                const mergedMatches = baseData.matches.map(match => {
                    const spiderChannel = findChannelInScrapedData(channelsData, match.team1.name, match.team2.name);
                    if (spiderChannel) {
                        match.broadcaster = spiderChannel;
                    }
                    return match;
                });
                // Kanallar bulunduktan sonra kartları sessizce günceller
                processMatches(mergedMatches);
            }
        }).catch(err => console.error("Örümcek arka planda hata verdi", err));

    } catch (error) {
        console.error('Örümcek ağa takıldı:', error);
        document.getElementById('today-matches').innerHTML = '<div class="no-matches">Sistem geçici olarak ulaşılamıyor.</div>';
    }
}

async function scrapeTurkishBroadcasters() {
    // CORS sorununu aşmak için güvenli proxy kullanıyoruz. Uygulama başka siteleri sömürür.
    const targetUrl = 'https://www.sporekrani.com/home/league/fifa-2026-dunya-kupasi';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // Gelen HTML'i tarayıcının hafızasında sanal bir DOM'a dönüştür (Scraping)
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const matchesInfo = [];
        const bodyText = doc.body.innerText || "";
        
        // Örümcek Metin Analizi: Eğer site üzerinde "TOD TV" yazısı belirmişse, 
        // Türkiye'nin maçının yayın haklarının TOD TV'de (veya ortak) olduğunu anlar.
        // Bu yapı ileride daha da geliştirilip her maç için spesifik kazıma yapabilir.
        if (bodyText.includes("TOD TV") || bodyText.includes("TOD")) {
            matchesInfo.push({ teams: ["Türkiye", "ABD"], channel: "TOD TV / TRT 1" });
            matchesInfo.push({ teams: ["Avustralya", "Türkiye"], channel: "TOD TV / TRT" });
        }
        
        return matchesInfo;
    } catch(e) {
        console.warn("Örümcek hedefe sızamadı, veritabanındaki kesin kanallar kullanılacak.", e);
        return [];
    }
}

function findChannelInScrapedData(scrapedData, t1, t2) {
    for(let item of scrapedData) {
        if (item.teams.includes(t1) || item.teams.includes(t2)) {
            return item.channel;
        }
    }
    return null;
}

function processMatches(matches) {
    const todayMatchesContainer = document.getElementById('today-matches');
    const upcomingMatchesContainer = document.getElementById('upcoming-matches');
    const allFixturesContainer = document.getElementById('all-fixtures');
    
    todayMatchesContainer.innerHTML = '';
    upcomingMatchesContainer.innerHTML = '';
    allFixturesContainer.innerHTML = '';

    // Simulate current date as June 11, 2026 for testing if we are before the tournament
    // Otherwise use real today
    let currentRealDate = new Date();
    const tournamentStart = new Date('2026-06-11T00:00:00Z');
    
    // For demonstration, if current date is before June 11, pretend it is June 11
    if (currentRealDate < tournamentStart) {
        currentRealDate = tournamentStart;
    }

    // Get start and end of "today" in TRT
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = formatter.format(currentRealDate); // YYYY-MM-DD in TRT

    let todayMatches = [];
    let upcomingMatches = [];

    matches.forEach(match => {
        const matchDateUTC = new Date(match.date_utc);
        const matchDayStr = formatter.format(matchDateUTC);
        
        if (matchDayStr === todayStr) {
            todayMatches.push(match);
        } else if (matchDateUTC > currentRealDate) {
            upcomingMatches.push(match);
        }

        // Add to all fixtures
        allFixturesContainer.appendChild(createMatchCard(match));
    });

    // Render Today
    if (todayMatches.length > 0) {
        todayMatches.forEach(match => {
            todayMatchesContainer.appendChild(createMatchCard(match));
        });
    } else {
        todayMatchesContainer.innerHTML = '<div class="no-matches">Bugün maç bulunmamaktadır.</div>';
    }

    // Render Upcoming
    if (upcomingMatches.length > 0) {
        // Just show the next 3 upcoming matches
        upcomingMatches.slice(0, 3).forEach(match => {
            upcomingMatchesContainer.appendChild(createMatchCard(match));
        });
    } else {
        upcomingMatchesContainer.innerHTML = '<div class="no-matches">Yaklaşan maç bulunmamaktadır.</div>';
    }
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';

    // Time Formatting (TRT)
    const matchDateUTC = new Date(match.date_utc);
    const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' };
    const dateOptions = { day: 'numeric', month: 'short', timeZone: 'Europe/Istanbul' };
    
    const timeStr = matchDateUTC.toLocaleTimeString('tr-TR', timeOptions);
    const dateStr = matchDateUTC.toLocaleDateString('tr-TR', dateOptions);

    card.innerHTML = `
        <div class="match-header">
            <span class="match-group">${match.group}</span>
            <span class="match-tv">${match.broadcaster}</span>
        </div>
        <div class="match-teams">
            <div class="team">
                <span class="flag">${match.team1.flag}</span>
                <span class="team-name">${match.team1.name}</span>
            </div>
            <div class="match-center">
                <span class="match-time">${timeStr}</span>
                <span class="match-date-badge">${dateStr}</span>
            </div>
            <div class="team">
                <span class="flag">${match.team2.flag}</span>
                <span class="team-name">${match.team2.name}</span>
            </div>
        </div>
        <div class="match-footer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${match.stadium}
        </div>
    `;

    return card;
}
