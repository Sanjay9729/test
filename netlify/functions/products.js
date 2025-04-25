require("dotenv").config();
const fetch = require("node-fetch");

const SHOP = process.env.SHOP;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = process.env.API_VERSION;

async function fetchAllProducts() {
    let products = [];
    let url = `https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=250`;
    let hasNextPage = true;

    while (hasNextPage) {
        const response = await fetch(url, {
            headers: {
                "X-Shopify-Access-Token": ACCESS_TOKEN,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Shopify API error: ${errorText}`);
        }

        const data = await response.json();
        products = products.concat(data.products);

        const linkHeader = response.headers.get("link");
        if (linkHeader && linkHeader.includes('rel="next"')) {
            const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
            url = match ? match[1] : null;
            hasNextPage = !!url;
        } else {
            hasNextPage = false;
        }
    }

    return products;
}

exports.handler = async (event, context) => {
    try {
        const allProducts = await fetchAllProducts();
        const minimalProducts = allProducts.map((p) => ({
            id: p.id,
            title: p.title,
            images: p.images,
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(minimalProducts),
        };
    } catch (err) {
        console.error("Error fetching products:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch products" }),
        };
    }
};
