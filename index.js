const fs = require('node:fs')
const http = require('node:http')
const url = require('node:url')
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate.js');

//Templates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');

//API
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(el => slugify(el.productName, { lower: true }))
console.log(slugs);


const server = http.createServer((req, res) => {
    const request = req.url;    

    const parsed = url.parse(request, true)

    const {query, pathname} = parsed;

    switch (pathname) {
        case ('/' || '/home'):
            res.writeHead(200, {
                "Content-type": "text/html",
            })

            const cardsHtml = dataObject.map(el => {
                return replaceTemplate(tempCard, el)
            }).join()

            const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)

            res.end(output);
            break;

        case '/product': 
            res.writeHead(200, {
                "Content-type": "text/html",
            })
            const product = dataObject[query.id]

            const productOutput = replaceTemplate(tempProduct, product)

            res.end(productOutput);
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