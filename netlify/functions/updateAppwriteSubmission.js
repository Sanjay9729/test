// netlify/functions/updateAppwriteSubmission.js
const sdk = require('node-appwrite');

exports.handler = async function (event, context) {
  const client = new sdk.Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // or your self-hosted endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);
  const { id, full_name, email, selected_product, phone, address } = JSON.parse(event.body);

  try {
    await databases.updateDocument(
      process.env.APPWRITE_DB_ID,
      process.env.APPWRITE_COLLECTION_ID,
      id,
      { full_name, email, selected_product, phone, address }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
