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
            // Added a slightly more modern User-Agent to help avoid bot detection
            const { data } = await axios.get(product.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            });
            const $ = cheerio.load(data);

            // 1. Price Logic
            const priceText = $('.price-current strong').first().text().replace(',', '');
            const centsText = $('.price-current sup').first().text() || "00";

            // 2. Image Logic (Based on your verified Screenshot 2026-04-29)
            const imgPath = $('.product-view-img-original').attr('src');

            // 3. Notable Specs Logic
            const specs = [];
            $('.product-bullets li, .item-details li').each((i, el) => {
                const specText = $(el).text().trim();
                if (specText && specs.length < 4) {
                    specs.push(specText);
                }
            });

            if (priceText) {
                product.price = parseFloat(`${priceText}${centsText}`);
                product.specs = specs;

                if (imgPath) {
                    product.image = imgPath.startsWith('http') ? imgPath : `https:${imgPath}`;
                }

                console.log(`Updated ${product.id}: $${product.price} | Specs: ${specs.length} | Img: ${!!product.image}`);
            }
        } catch (err) {
            console.error(`Failed to fetch ${product.id}:`, err.message);
        }

        // Anti-throttle: Wait 1.5 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    const metadata = {
        lastSync: new Date().toISOString(),
        status: "success",
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