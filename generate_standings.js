const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const groups = {};

// Process all group matches
data.matches.filter(m => m.group && m.group.includes('Grubu')).forEach(m => {
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

let html = fs.readFileSync('index.html', 'utf8');
const sortedGroups = Object.keys(groups).sort((a, b) => a.localeCompare(b));
let standingsHTML = '';

sortedGroups.forEach(gName => {
    const teams = Object.values(groups[gName]);
    teams.sort((a, b) => {
        if (b.Pts !== a.Pts) return b.Pts - a.Pts;
        if (b.GD !== a.GD) return b.GD - a.GD;
        return b.GF - a.GF;
    });

    standingsHTML += `
            <h2 class="section-title">${gName}</h2>
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
                <tbody>`;

    teams.forEach(t => {
        standingsHTML += `
                    <tr>
                        <td class="team-cell"><span class="flag">${t.flag}</span> ${t.name}</td>
                        <td>${t.P}</td>
                        <td>${t.W}</td>
                        <td>${t.D}</td>
                        <td>${t.L}</td>
                        <td>${t.GD > 0 ? '+' + t.GD : t.GD}</td>
                        <td><strong>${t.Pts}</strong></td>
                    </tr>`;
    });

    standingsHTML += `
                </tbody>
            </table>`;
});

// Replace tab-standings content
html = html.replace(/<section id="tab-standings" class="tab-content">[\s\S]*?<\/section>/, '<section id="tab-standings" class="tab-content">\n' + standingsHTML + '\n        </section>');

fs.writeFileSync('index.html', html);
console.log("Successfully generated and saved static standings to index.html.");
