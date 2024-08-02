const fs = require('node:fs')
const http = require('node:http')
const url = require('node:url')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObject = JSON.parse(data);




const server = http.createServer((req, res) => {
    const pathName = req.url;

    switch (pathName) {
        case '/':
            res.end('Welcome to Homepage');
            break;
        case '/api':
            res.writeHead(200, { "Content-type": "application/json" })
            res.end(data);
            break;
        default:
            res.writeHead(404, {
                "Content-type": "text/html",
                "Custom-header": "Sample-header"
            })

            res.end('Route not found');
            break;
    }
})

const port = 8000;

server.listen(port, 'localhost', () => {
    console.log(`Listening on port ${port}`);
})