// // netlify/functions/updateAppwriteSubmission.js
// const sdk = require('node-appwrite');

// exports.handler = async function (event, context) {
//   const client = new sdk.Client()
//     .setEndpoint('https://cloud.appwrite.io/v1') // or your self-hosted endpoint
//     .setProject(process.env.APPWRITE_PROJECT_ID)
//     .setKey(process.env.APPWRITE_API_KEY);

//   const databases = new sdk.Databases(client);
//   const { id, full_name, email, selected_product, phone, address } = JSON.parse(event.body);

//   try {
//     await databases.updateDocument(
//       process.env.APPWRITE_DB_ID,
//       process.env.APPWRITE_COLLECTION_ID,
//       id,
//       { full_name, email, selected_product, phone, address }
//     );

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message }),
//     };
//   }
// };


const sdk = require('node-appwrite');

exports.handler = async function (event, context) {
  // ✅ Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let data;

  try {
    data = JSON.parse(event.body); // ✅ parse incoming JSON
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { id, full_name, email, selected_product, phone, address } = data;

  // ✅ Check required ID
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Document ID is required.' }),
    };
  }

  // ✅ Appwrite Client Setup
  const client = new sdk.Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // or your custom endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);

  try {
    await databases.updateDocument(
      process.env.APPWRITE_DB_ID,
      process.env.APPWRITE_COLLECTION_ID,
      id,
      {
        full_name,
        email,
        selected_product,
        phone,
        address,
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
