const fs = require('node:fs')
const http = require('node:http')
const url = require('node:url')

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%QUANTITY%}/g, "not-organic");
    return output;
}

//Templates
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');

//API
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObject = JSON.parse(data);




const server = http.createServer((req, res) => {
    const pathName = req.url;

    switch (pathName) {
        case '/' || '/home':
            res.writeHead(200, {
                "Content-type": "text/html",
            })

            const cardsHtml = dataObject.map((e) => {
                replaceTemplate(templateCard, e)
            })

            console.log(cardsHtml);
            

            res.end(templateOverview);
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