const express = require('express');
const { chromium } = require('playwright');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSERLESS_URL = process.env.BROWSERLESS_URL;

app.get('/scrape', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).send({ error: 'Missing query' });

    try {
        const browser = await chromium.connectOverCDP(BROWSERLESS_URL);
        const page = await browser.newPage({
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
        });

        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });

        // Attente légère pour laisser Google charger le contenu
        await page.waitForTimeout(1000);

        const results = await page.$$eval('div.tF2Cxc', nodes => {
            return nodes.map(el => {
                const title = el.querySelector('h3')?.innerText || '';
                const url = el.querySelector('a')?.href || '';
                const snippet = el.querySelector('.VwiC3b')?.innerText || '';
                return { title, url, snippet };
            });
        });

        await browser.close();
        res.send({ query, results });
    } catch (err) {
        console.error('Scraping error:', err);
        res.status(500).send({ error: 'Scraping failed', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Scraper ready at http://localhost:${PORT}`);
});
