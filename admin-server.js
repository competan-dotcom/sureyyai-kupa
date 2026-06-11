const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'admin.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end("Admin paneli bulunamadi.");
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } 
    else if (req.method === 'GET' && req.url.startsWith('/data.json')) {
        fs.readFile(path.join(__dirname, 'data.json'), (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end("data.json bulunamadi");
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(content);
        });
    }
    else if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                // JSON formatında diske yaz
                fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(newData, null, 4));
                
                // GitHub'a Pushla
                console.log("Değişiklikler algılandı, GitHub'a gönderiliyor...");
                exec('git add data.json && git commit -m "Admin panelinden skor güncellemesi" && git push origin master', (err, stdout, stderr) => {
                    if (err) {
                        console.error("Git Hatası:", stderr);
                        res.writeHead(500);
                        res.end(JSON.stringify({ success: false, error: stderr }));
                        return;
                    }
                    console.log("Başarıyla GitHub'a yüklendi!");
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: "GitHub push basarili!" }));
                });
            } catch (e) {
                console.error("JSON Hatası:", e);
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
    } else {
        res.writeHead(404);
        res.end("Bulunamadi");
    }
});

server.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🏆 SÜREYYA AI ADMIN PANELİ BAŞLATILDI`);
    console.log(`Lütfen tarayıcından şu adrese git: http://localhost:${PORT}`);
    console.log(`=================================================\n`);
});
