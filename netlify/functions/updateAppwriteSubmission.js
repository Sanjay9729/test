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
  console.log('Update request received');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST allowed' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
    
  } catch (err) {
    console.error('JSON Parse Error:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { id, full_name, email, selected_product, phone, address } = data;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing document ID' }),
    };
  }

  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);

  try {
    const updated = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,        // ✅ corrected here
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

    console.log('Updated successfully:', updated);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Appwrite error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Update failed' }),
    };
  }
};


