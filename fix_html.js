const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove the garbage at the top
if (html.startsWith('LKJIHGFEDCBA')) {
    html = html.substring(12);
}

// Replace each ${g} with the correct group letter
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
groups.forEach(g => {
    html = html.replace('${g}', g);
});

fs.writeFileSync('index.html', html);
