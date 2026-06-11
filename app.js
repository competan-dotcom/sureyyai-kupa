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

    // Shrink header on scroll
    const header = document.querySelector('.app-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Date and Time Header Logic
    const updateTime = () => {
        const today = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Istanbul' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Istanbul' };
        
        document.getElementById('current-date').textContent = today.toLocaleDateString('tr-TR', dateOptions);
        document.getElementById('current-time').textContent = today.toLocaleTimeString('tr-TR', timeOptions);
    };
    
    updateTime();
    setInterval(updateTime, 1000);

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
    const container = document.getElementById('all-fixtures');
    if (!container) return; // If we're not on home tab
    container.innerHTML = '';
    
    // Group matches by Date (TRT)
    const formatter = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    
    const grouped = {};
    matches.forEach(match => {
        const matchDateUTC = new Date(match.date_utc);
        const dateKey = formatter.format(matchDateUTC);
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(match);
    });

    let elementToScrollTo = null;
    
    // RENDER DYNAMIC STANDINGS
    renderStandings(matches);

    Object.keys(grouped).forEach(dateStr => {
        const header = document.createElement('div');
        header.className = 'date-header';
        header.textContent = dateStr;
        container.appendChild(header);

        grouped[dateStr].forEach(match => {
            const card = createMatchCard(match);
            container.appendChild(card);
            
            // Set scroll target to the first date header where matches are NOT finished
            if (!elementToScrollTo && match.status !== 'finished') {
                elementToScrollTo = header;
            }
        });
    });

    // Auto-Scroll Logic: Wait for DOM to render then scroll to the first upcoming match's date header
    if (elementToScrollTo) {
        setTimeout(() => {
            // Smoothly scroll the page so the header is near the top (minus the fixed top nav height)
            const y = elementToScrollTo.getBoundingClientRect().top + window.scrollY - 180;
            window.scrollTo({top: y, behavior: 'smooth'});
        }, 300);
    }
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    if (match.status === 'finished') {
        card.classList.add('completed');
    }

    // Time Formatting (TRT)
    const matchDateUTC = new Date(match.date_utc);
    const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' };
    const timeStr = matchDateUTC.toLocaleTimeString('tr-TR', timeOptions);

    let centerContent = `<span class="match-time">${timeStr}</span>`;
    if (match.score) {
        centerContent = `
            <span class="match-time" style="font-size: 42px;">${match.score}</span>
            <span class="match-date-badge" style="color: #64748b;">MAÇ SONUCU</span>
        `;
    }

    let footerContent = '';
    if (match.stadium) {
        footerContent = `
        <div class="match-footer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${match.stadium}
        </div>
        `;
    }

    card.innerHTML = `
        <div class="match-header">
            <span class="match-group">${match.group}</span>
            <span class="match-tv">
                <svg class="tv-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
                <span class="tv-text">${match.broadcaster}</span>
            </span>
        </div>
        <div class="match-teams">
            <div class="team">
                <span class="flag">${match.team1.flag}</span>
                <span class="team-name">${match.team1.name}</span>
            </div>
            <div class="match-center">
                ${centerContent}
            </div>
            <div class="team">
                <span class="flag">${match.team2.flag}</span>
                <span class="team-name">${match.team2.name}</span>
            </div>
        </div>
        ${footerContent}
    `;

    return card;
}
