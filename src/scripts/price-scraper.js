// scripts/price-scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { products } from '../data/products.js';

async function updatePrices() {
    console.log("Starting price sync...");

    for (let product of products) {
        if (!product.url) continue;

        try {
            const { data } = await axios.get(product.url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const $ = cheerio.load(data);

            // 1. Price Logic
            const priceText = $('.price-current strong').first().text().replace(',', '');
            const centsText = $('.price-current sup').first().text() || "00";

            // 2. Image Logic - Using the class from your screenshot
            // We target the class 'product-view-img-original'
            const imgPath = $('.product-view-img-original').attr('src');

            if (priceText) {
                product.price = parseFloat(`${priceText}${centsText}`);

                if (imgPath) {
                    // Ensure the URL is absolute
                    product.image = imgPath.startsWith('http') ? imgPath : `https:${imgPath}`;
                }

                console.log(`Updated ${product.id}: $${product.price} | Img: ${!!product.image}`);
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