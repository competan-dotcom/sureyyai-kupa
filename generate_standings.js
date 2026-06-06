const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let groupsMap = {};

// Filter only group matches
data.matches.filter(m => m.group && m.group.includes('Grubu')).forEach(m => {
    if (!groupsMap[m.group]) groupsMap[m.group] = new Map();
    
    if (m.team1 && m.team1.name && !groupsMap[m.group].has(m.team1.name)) {
        groupsMap[m.group].set(m.team1.name, m.team1.flag);
    }
    if (m.team2 && m.team2.name && !groupsMap[m.group].has(m.team2.name)) {
        groupsMap[m.group].set(m.team2.name, m.team2.flag);
    }
});

let html = fs.readFileSync('index.html', 'utf8');

const sortedGroups = Object.keys(groupsMap).sort((a, b) => a.localeCompare(b));

let standingsHTML = '';

sortedGroups.forEach(g => {
    standingsHTML += `
            <h2 class="section-title">${g}</h2>
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
                <tbody>`;

    const teams = Array.from(groupsMap[g].entries()); // [name, flag]
    
    teams.forEach(([name, flag]) => {
        standingsHTML += `
                    <tr>
                        <td class="team-cell"><span class="flag">${flag}</span> ${name}</td>
                        <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                    </tr>`;
    });

    standingsHTML += `
                </tbody>
            </table>`;
});

// Replace tab-standings content
html = html.replace(/<section id="tab-standings" class="tab-content">[\s\S]*?<\/section>/, '<section id="tab-standings" class="tab-content">\n' + standingsHTML + '\n        </section>');

fs.writeFileSync('index.html', html);
