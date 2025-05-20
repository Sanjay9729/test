const { Shopify } = require('@shopify/shopify-api');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No request body provided' }),
      };
    }

    const shopName = process.env.SHOPIFY_STORE_NAME;
    const accessToken = process.env.SHOPIFY_API_TOKEN;

    if (!shopName || !accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Shopify credentials' }),
      };
    }

    const shopify = new Shopify.Clients.Rest(shopName, accessToken);

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { full_name, email, phone, address, selected_product, user_id } = data;

    if (!full_name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: full_name, email' }),
      };
    }

    // Debug logs (optional)
    console.log('🔍 Received data:', data);
    console.log('🔐 Shopify Store:', shopName);

    // Split full name
    const nameParts = full_name.trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Step 1: Search for or create customer
    let customer = null;
    try {
      const searchResponse = await shopify.get({
        path: 'customers/search',
        query: { query: `email:${email}` },
      });

      if (searchResponse.body.customers.length > 0) {
        customer = searchResponse.body.customers[0];
      } else {
        const customerResponse = await shopify.post({
          path: 'customers',
          data: {
            customer: {
              first_name: firstName,
              last_name: lastName,
              email,
              phone: phone || null,
              addresses: address ? [{ address1: address }] : [],
              verified_email: true,
            },
          },
          type: 'application/json', // ✅ FIXED
        });

        customer = customerResponse.body.customer;
      }
    } catch (error) {
      console.error('❌ Customer lookup/creation error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Failed to create/find customer: ${error.message}` }),
      };
    }

    // Step 2: Add metafield to customer
    try {
      const metafield = await shopify.post({
        path: `customers/${customer.id}/metafields`,
        data: {
          metafield: {
            namespace: 'warranty',
            key: `submission_${user_id}_${Date.now()}`,
            type: 'json',
            value: JSON.stringify({
              address,
              email,
              full_name,
              phone,
              selected_product,
              user_id,
            }),
          },
        },
        type: 'application/json', // ✅ FIXED
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: '✅ Data saved to Shopify successfully.',
          customer_id: customer.id,
          metafield_id: metafield.body.metafield.id,
        }),
      };
    } catch (error) {
      console.error('❌ Metafield creation error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Failed to create metafield: ${error.message}` }),
      };
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Unexpected error: ${error.message}` }),
    };
  }
};
