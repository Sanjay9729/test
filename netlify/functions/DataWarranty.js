const axios = require('axios');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const shop = process.env.SHOPIFY_STORE_NAME;
    const token = process.env.SHOPIFY_API_TOKEN; // <-- using SHOPIFY_API_TOKEN now

    if (!shop || !token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Shopify credentials' }),
      };
    }

    const data = JSON.parse(event.body || '{}');
    const { full_name, email, phone, address, selected_product, user_id } = data;

    if (!full_name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing full name or email' }),
      };
    }

    const nameParts = full_name.trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    const headers = {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    };

    // Step 1: Check if customer exists
    let customer;
    try {
      const searchRes = await axios.get(
        `https://${shop}/admin/api/2023-10/customers/search.json?query=email:${email}`,
        { headers }
      );

      if (searchRes.data.customers.length > 0) {
        customer = searchRes.data.customers[0];
      } else {
        const createRes = await axios.post(
          `https://${shop}/admin/api/2023-10/customers.json`,
          {
            customer: {
              first_name: firstName,
              last_name: lastName,
              email,
              phone: phone || null,
              addresses: address ? [{ address1: address }] : [],
              verified_email: true,
            },
          },
          { headers }
        );

        customer = createRes.data.customer;
      }
    } catch (err) {
      console.error('❌ Customer error:', err.response?.data || err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create/find customer' }),
      };
    }

    // Step 2: Add metafield
    try {
      const metafieldRes = await axios.post(
        `https://${shop}/admin/api/2023-10/metafields.json`,
        {
          metafield: {
            owner_resource: 'customer',
            owner_id: customer.id,
            namespace: 'warranty',
            key: `submission_${user_id}_${Date.now()}`,
            type: 'json',
            value: JSON.stringify({ full_name, email, phone, address, selected_product, user_id }),
          },
        },
        { headers }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: '✅ Data saved to Shopify successfully.',
          customer_id: customer.id,
          metafield_id: metafieldRes.data.metafield.id,
        }),
      };
    } catch (err) {
      console.error('❌ Metafield error:', err.response?.data || err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create metafield' }),
      };
    }

  } catch (err) {
    console.error('❌ Unexpected server error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Unexpected error: ${err.message}` }),
    };
  }
};
