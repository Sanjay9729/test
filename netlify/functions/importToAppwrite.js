const sdk = require('node-appwrite');

// Initialize the Appwrite client
const client = new sdk.Client();
const database = new sdk.Databases(client);

// Set up Appwrite connection using environment variables
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your Appwrite endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID) // Your Appwrite project ID
  .setKey(process.env.APPWRITE_API_KEY); // Your Appwrite API key with write access

exports.handler = async (event) => {
  try {
    const { data } = JSON.parse(event.body);

    if (!Array.isArray(data) || data.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No data found' }) };
    }

    // Map data to match the structure of your Appwrite database
    const mapped = data.map(item => ({
      email: item.email || '',
      full_name: item.full_name || '',
      selected_product: item.selected_product || '',
      phone: item.phone || '',
      address: item.address || '',
    }));

    const collectionId = process.env.APPWRITE_COLLECTION_ID;
    const databaseId = process.env.APPWRITE_DATABASE_ID;

    // Insert documents concurrently
    const promises = mapped.map(doc =>
      database.createDocument(databaseId, collectionId, sdk.ID.unique(), doc)
    );

    await Promise.all(promises);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
