```javascript
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    let filePath = req.url === "/"
        ? path.join(__dirname, "index.html")
        : path.join(__dirname, req.url);

    // منع الوصول لملفات خارج المشروع
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    const ext = path.extname(filePath).toLowerCase();

    const contentTypes = {
        ".html": "text/html; charset=UTF-8",
        ".css": "text/css; charset=UTF-8",
        ".js": "application/javascript; charset=UTF-8",
        ".json": "application/json; charset=UTF-8",
        ".txt": "text/plain; charset=UTF-8",
        ".xml": "application/xml; charset=UTF-8"
    };

    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, {
                "Content-Type": "text/plain; charset=UTF-8"
            });

            res.end("File not found");
            return;
        }

        res.writeHead(200, {
            "Content-Type":
                contentTypes[ext] || "application/octet-stream"
        });

        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Dino AI is running on port ${PORT}`);
});
```
