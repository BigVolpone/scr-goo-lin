const express = require('express');
const { chromium } = require('playwright');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSERLESS_URL = process.env.BROWSERLESS_URL;

app.get('/scrape', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send({ error: 'Missing query' });

    const browser = await chromium.connectOverCDP(BROWSERLESS_URL);
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    const results = await page.$$eval('div.g', nodes => {
        return nodes.map(el => {
            const title = el.querySelector('h3')?.innerText || '';
            const url = el.querySelector('a')?.href || '';
            const snippet = el.querySelector('.VwiC3b')?.innerText || '';
            return { title, url, snippet };
        });
    });

    await browser.close();
    res.send({ query, results });
});

app.listen(PORT, () => {
    console.log(`Scraper ready at http://localhost:${PORT}`);
});