const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 5000;

app.use(cors());

const SHOP = "wholesale.ellastein.com";
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = "2024-01";

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

app.get("/products", async (req, res) => {
  try {
    const allProducts = await fetchAllProducts();
    const minimalProducts = allProducts.map((p) => ({
      id: p.id,
      title: p.title,
      images: p.images,
    }));

    res.json(minimalProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
