const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<section id="tab-standings" class="tab-content">[\s\S]*?<\/section>/, `<section id="tab-standings" class="tab-content">
            <!-- Dynamic content rendered by app.js -->
        </section>`);
fs.writeFileSync('index.html', html);

let js = fs.readFileSync('app.js', 'utf8');
const renderStandingsLogic = `
function renderStandings(matches) {
    const groups = {};
    matches.filter(m => m.group && m.group.includes('Grubu')).forEach(m => {
        if (!groups[m.group]) groups[m.group] = {};
        
        if (!groups[m.group][m.team1.name]) {
            groups[m.group][m.team1.name] = { name: m.team1.name, flag: m.team1.flag, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
        }
        if (!groups[m.group][m.team2.name]) {
            groups[m.group][m.team2.name] = { name: m.team2.name, flag: m.team2.flag, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
        }
        
        if (m.status === 'finished' && m.score) {
            const [s1, s2] = m.score.split('-').map(Number);
            groups[m.group][m.team1.name].P++;
            groups[m.group][m.team2.name].P++;
            groups[m.group][m.team1.name].GF += s1;
            groups[m.group][m.team1.name].GA += s2;
            groups[m.group][m.team2.name].GF += s2;
            groups[m.group][m.team2.name].GA += s1;
            groups[m.group][m.team1.name].GD = groups[m.group][m.team1.name].GF - groups[m.group][m.team1.name].GA;
            groups[m.group][m.team2.name].GD = groups[m.group][m.team2.name].GF - groups[m.group][m.team2.name].GA;
            
            if (s1 > s2) {
                groups[m.group][m.team1.name].W++;
                groups[m.group][m.team1.name].Pts += 3;
                groups[m.group][m.team2.name].L++;
            } else if (s1 < s2) {
                groups[m.group][m.team2.name].W++;
                groups[m.group][m.team2.name].Pts += 3;
                groups[m.group][m.team1.name].L++;
            } else {
                groups[m.group][m.team1.name].D++;
                groups[m.group][m.team2.name].D++;
                groups[m.group][m.team1.name].Pts += 1;
                groups[m.group][m.team2.name].Pts += 1;
            }
        }
    });

    const container = document.getElementById('tab-standings');
    if (!container) return;
    
    const sortedGroups = Object.keys(groups).sort((a,b) => a.localeCompare(b));
    let newHtml = '';
    
    sortedGroups.forEach(gName => {
        const teams = Object.values(groups[gName]);
        teams.sort((a, b) => {
            if (b.Pts !== a.Pts) return b.Pts - a.Pts;
            if (b.GD !== a.GD) return b.GD - a.GD;
            return b.GF - a.GF;
        });
        
        newHtml += \`<h2 class="section-title">\${gName}</h2>
            <table class="mockup-table">
                <thead>
                    <tr>
                        <th>Takım</th>
                        <th>O</th>
                        <th>G</th>
                        <th>B</th>
                        <th>M</th>
                        <th>Av</th>
                        <th>P</th>
                    </tr>
                </thead>
                <tbody>\`;
                
        teams.forEach(t => {
            newHtml += \`<tr>
                        <td class="team-cell"><span class="flag">\${t.flag}</span> \${t.name}</td>
                        <td>\${t.P}</td>
                        <td>\${t.W}</td>
                        <td>\${t.D}</td>
                        <td>\${t.L}</td>
                        <td>\${t.GD}</td>
                        <td style="font-weight: 800; color: var(--accent);">\${t.Pts}</td>
                    </tr>\`;
        });
        
        newHtml += \`</tbody></table>\`;
    });
    
    container.innerHTML = newHtml;
}
`;

// Insert renderStandings logic
if (!js.includes('function renderStandings')) {
    js += '\\n' + renderStandingsLogic;
}

// Ensure processMatches calls renderStandings
if (!js.includes('renderStandings(matches);')) {
    js = js.replace('function processMatches(matches) {', 'function processMatches(matches) {\\n    renderStandings(matches);');
}

// Update createMatchCard for finished matches with footballia link
const cardLogicRegex = /if \\(match\\.stadium\\) \\{[\\s\\S]*?footerContent = \`[\\s\\S]*?\`;\\n    \\}/;
const newCardLogic = `
    if (match.status === 'finished') {
        const query = encodeURIComponent(\`\${match.team1.name} \${match.team2.name} 2026\`);
        footerContent = \`
        <div class="match-footer" style="flex-direction: column;">
            \${match.stadium ? \`<div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom: 8px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                \${match.stadium}
            </div>\` : ''}
            <a href="https://footballia.net/tr/search?utf8=✓&q=\${query}" target="_blank" style="display:inline-block; padding:8px 16px; background:#e30a17; color:white; border-radius:8px; text-decoration:none; font-weight:600; font-size:12px; transition: opacity 0.2s;">
                ▶ Maçı Tamamını İzle (Footballia)
            </a>
        </div>
        \`;
    } else if (match.stadium) {
        footerContent = \`
        <div class="match-footer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            \${match.stadium}
        </div>
        \`;
    }
`;
js = js.replace(cardLogicRegex, newCardLogic);

fs.writeFileSync('app.js', js);
