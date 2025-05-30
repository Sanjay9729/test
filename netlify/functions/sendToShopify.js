const fetch = require('node-fetch');

exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  const SHOPIFY_DOMAIN = '758da7-63.myshopify.com';
  const ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN; 

  try {
    // 1. Create Customer
    const customerRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/customers.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          first_name: data.full_name,
          email: data.email,
          phone: data.phone,
          addresses: [{ address1: data.address }]
        }
      })
    });

    const customerData = await customerRes.json();
    const customerId = customerData.customer?.id;

    // 2. Create Draft Order
    const orderRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/draft_orders.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        draft_order: {
          customer: { id: customerId },
          line_items: [{
            title: data.selected_product,
            quantity: 1,
            price: 0.0
          }]
        }
      })
    });

    const order = await orderRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, order })
    };
  } catch (err) {
    console.error('Shopify sync error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
