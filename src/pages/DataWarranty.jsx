const { Shopify } = require('@shopify/shopify-api');

exports.handler = async (event) => {
  try {
    // Initialize Shopify client
    const shopify = new Shopify({
      shopName: process.env.SHOPIFY_STORE_NAME, // e.g., 'your-store-name'
      accessToken: process.env.SHOPIFY_API_TOKEN,
    });

    // Parse incoming data from Appwrite
    const { address, email, full_name, phone, selected_product, user_id } = JSON.parse(event.body);

    // Create or find customer
    let customer;
    try {
      // Check if customer exists by email
      const existingCustomers = await shopify.rest.Customer.search({ query: `email:${email}` });
      customer = existingCustomers[0];
      
      if (!customer) {
        // Create new customer
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
      throw new Error('Failed to create or find customer');
    }

    // Add metafield to customer for warranty details
    const metafield = await shopify.rest.Metafield.create({
      namespace: 'warranty',
      key: `submission_${user_id}_${Date.now()}`, // Unique key for each submission
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
    console.error('Shopify error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
  
};

