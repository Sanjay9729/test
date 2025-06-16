require("dotenv").config();
const fetch = require("node-fetch");

const SHOP = process.env.SHOP; // e.g. 'wholesale.ellastein.com'
const ACCESS_TOKEN = process.env.SHOPIFY_API_TOKEN;
const API_VERSION = process.env.API_VERSION || '2024-01';

async function fetchAllProducts() {
  let allProducts = [];
  let url = `https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=250`;
  let hasNextPage = true;

  while (hasNextPage && url) {
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
    allProducts = allProducts.concat(data.products);

    const linkHeader = response.headers.get("link") || response.headers.get("Link");
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
      hasNextPage = !!url;
    } else {
      hasNextPage = false;
    }
  }

  console.log("✅ Total products fetched from Shopify:", allProducts.length);
  return allProducts;
}

exports.handler = async (event, context) => {
  try {
    if (!SHOP || !ACCESS_TOKEN || !API_VERSION) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing environment variables (SHOP, SHOPIFY_API_TOKEN, API_VERSION)",
        }),
      };
    }

    const allProducts = await fetchAllProducts();

    // Debug for category check
    const earrings = allProducts.filter(
      (p) =>
        p.product_type?.toLowerCase() === "earring" ||
        (Array.isArray(p.tags) &&
          p.tags.some((tag) => tag.toLowerCase().includes("earring"))) ||
        p.title?.toLowerCase().includes("earring")
    );
    console.log("🧪 Earring products found:", earrings.length);

    const minimalProducts = allProducts.map((p) => ({
      id: p.id,
      title: p.title,
      images: p.images,
      product_type: p.product_type,
      tags: p.tags,
      handle: p.handle,
      vendor: p.vendor,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(minimalProducts),
    };
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch products",
        details: err.message,
      }),
    };
  }
};
