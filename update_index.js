const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
let standingsHTML = '';

groups.forEach(g => {
    standingsHTML += `
            <h2 class="section-title">\${g} Grubu</h2>
            <table class="mockup-table">
                <thead>
                    <tr>
                        <th>Takım</th>
                        <th>O</th>
                        <th>G</th>
                        <th>B</th>
                        <th>M</th>
                        <th>P</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="team-cell"><span class="flag">🌍</span> 1. Takım</td>
                        <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                    </tr>
                    <tr>
                        <td class="team-cell"><span class="flag">🌍</span> 2. Takım</td>
                        <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                    </tr>
                    <tr>
                        <td class="team-cell"><span class="flag">🌍</span> 3. Takım</td>
                        <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                    </tr>
                    <tr>
                        <td class="team-cell"><span class="flag">🌍</span> 4. Takım</td>
                        <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                    </tr>
                </tbody>
            </table>
`;
});

const statsHTML = `
            <h2 class="section-title">Gol Krallığı</h2>
            <div class="mockup-stat-card">
                <div class="mockup-stat-left">
                    <span class="mockup-stat-rank">1</span>
                    <span class="flag">🇹🇷</span>
                    <div class="mockup-stat-info">
                        <h4>Barış Alper Yılmaz</h4>
                        <p>Türkiye</p>
                    </div>
                </div>
                <div class="mockup-stat-value">0</div>
            </div>
            <div class="mockup-stat-card">
                <div class="mockup-stat-left">
                    <span class="mockup-stat-rank">2</span>
                    <span class="flag">🇫🇷</span>
                    <div class="mockup-stat-info">
                        <h4>Kylian Mbappé</h4>
                        <p>Fransa</p>
                    </div>
                </div>
                <div class="mockup-stat-value">0</div>
            </div>
            <div class="mockup-stat-card">
                <div class="mockup-stat-left">
                    <span class="mockup-stat-rank">3</span>
                    <span class="flag">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                    <div class="mockup-stat-info">
                        <h4>Harry Kane</h4>
                        <p>İngiltere</p>
                    </div>
                </div>
                <div class="mockup-stat-value">0</div>
            </div>

            <h2 class="section-title" style="margin-top: 32px;">Asist Krallığı</h2>
            <div class="mockup-stat-card">
                <div class="mockup-stat-left">
                    <span class="mockup-stat-rank">1</span>
                    <span class="flag">🇹🇷</span>
                    <div class="mockup-stat-info">
                        <h4>Arda Güler</h4>
                        <p>Türkiye</p>
                    </div>
                </div>
                <div class="mockup-stat-value">0</div>
            </div>
            <div class="mockup-stat-card">
                <div class="mockup-stat-left">
                    <span class="mockup-stat-rank">2</span>
                    <span class="flag">🇧🇪</span>
                    <div class="mockup-stat-info">
                        <h4>Kevin De Bruyne</h4>
                        <p>Belçika</p>
                    </div>
                </div>
                <div class="mockup-stat-value">0</div>
            </div>

            <h2 class="section-title" style="margin-top: 32px;">En Çok Kurtarış</h2>
            <div class="mockup-stat-card">
                <div class="mockup-stat-left">
                    <span class="mockup-stat-rank">1</span>
                    <span class="flag">🇹🇷</span>
                    <div class="mockup-stat-info">
                        <h4>Mert Günok</h4>
                        <p>Türkiye</p>
                    </div>
                </div>
                <div class="mockup-stat-value">0</div>
            </div>
`;

// Replace tab-standings content
html = html.replace(/<section id="tab-standings" class="tab-content">[\s\S]*?<\/section>/, '<section id="tab-standings" class="tab-content">\n' + standingsHTML + '\n        </section>');

// Replace tab-stats content
html = html.replace(/<section id="tab-stats" class="tab-content">[\s\S]*?<\/section>/, '<section id="tab-stats" class="tab-content">\n' + statsHTML + '\n        </section>');

fs.writeFileSync('index.html', html);
