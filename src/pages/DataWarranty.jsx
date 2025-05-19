const { Shopify } = require('@shopify/shopify-api');

exports.handler = async (event) => {
  try {
    // Validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No request body provided' }),
      };
    }

    // Initialize Shopify client
    if (!process.env.SHOPIFY_STORE_NAME || !process.env.SHOPIFY_API_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Shopify environment variables missing' }),
      };
    }

    const shopify = new Shopify({
      shopName: process.env.SHOPIFY_STORE_NAME,
      accessToken: process.env.SHOPIFY_API_TOKEN,
    });

    // Parse incoming data
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { address, email, full_name, phone, selected_product, user_id } = data;

    // Validate required fields
    if (!email || !full_name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and full_name are required' }),
      };
    }

    // Create or find customer
    let customer;
    try {
      const existingCustomers = await shopify.rest.Customer.search({ query: `email:${email}` });
      customer = existingCustomers[0];

      if (!customer) {
        customer = await shopify.rest.Customer.create({
          first_name: full_name.split(' ')[0] || 'Unknown',
          last_name: full_name.split(' ').slice(1).join(' ') || 'Customer',
          email,
          phone: phone || null,
          addresses: address ? [{ address1: address }] : [],
        });
      }
    } catch (error) {
      console.error('Customer creation error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Failed to create/find customer: ${error.message}` }),
      };
    }

    // Add metafield
    try {
      const metafield = await shopify.rest.Metafield.create({
        namespace: 'warranty',
        key: `submission_${user_id}_${Date.now()}`,
        value: JSON.stringify({
          address,
          email,
          full_name,
          phone,
          selected_product,
          user_id,
        }),
        type: 'json',
        owner_resource: 'customer',
        owner_id: customer.id,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Data sent to Shopify',
          customer_id: customer.id,
          metafield_id: metafield.id,
        }),
      };
    } catch (error) {
      console.error('Metafield creation error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Failed to create metafield: ${error.message}` }),
      };
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Unexpected error: ${error.message}` }),
    };
  }
};