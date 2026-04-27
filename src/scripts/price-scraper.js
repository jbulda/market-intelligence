// scripts/price-scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { products } from '../src/data/products.js';

async function updatePrices() {
    console.log("Starting price sync...");

    for (let product of products) {
        if (!product.url) continue;

        try {
            const { data } = await axios.get(product.url, {
                headers: { 'User-Agent': 'Mozilla/5.0' } // Prevents basic bot blocking
            });
            const $ = cheerio.load(data);

            // Newegg Canada price selector
            const priceText = $('.price-current strong').first().text().replace(',', '');
            const centsText = $('.price-current sup').first().text() || "00";

            if (priceText) {
                const newPrice = parseFloat(`${priceText}${centsText}`);
                console.log(`Updated ${product.id}: $${newPrice}`);
                product.price = newPrice;
            }
        } catch (err) {
            console.error(`Failed to fetch ${product.id}:`, err.message);
        }
    }

    const metadata = {
        lastSync: new Date().toISOString(),
        status: "success", // or "error" if the catch block is triggered
        itemsTracked: products.length
    };

    const content = `
        export const syncMetadata = ${JSON.stringify(metadata, null, 4)};
        export const products = ${JSON.stringify(products, null, 4)};
        `;

    fs.writeFileSync('./src/data/products.js', content);
    console.log("Sync complete.");
}

updatePrices();