// const { Client, Databases } = require('node-appwrite');

// module.exports = async function (req, res) {
//   if (req.method !== 'POST') {
//     return res.json({ error: 'Method not allowed' }, 405);
//   }

//   let body;
//   try {
//     body = JSON.parse(req.body);
//   } catch (error) {
//     console.error('❌ JSON parse error:', error.message);
//     return res.json({ error: 'Invalid JSON body' }, 400);
//   }

//   const { id, full_name, email, selected_product, phone, address } = body;

//   if (!id) {
//     console.error('❌ Missing ID in request body');
//     return res.json({ error: 'Missing ID' }, 400);
//   }

//   // Debug environment variables
//   console.log('Environment variables:', {
//     endpoint: process.env.APPWRITE_ENDPOINT,
//     project: process.env.APPWRITE_PROJECT_ID,
//     key: !!process.env.APPWRITE_API_KEY,
//     db: process.env.APPWRITE_DATABASE_ID,
//     collection: process.env.APPWRITE_COLLECTION_ID,
//   });

//   const client = new Client()
//     .setEndpoint(process.env.APPWRITE_ENDPOINT) 
//     .setProject(process.env.APPWRITE_PROJECT_ID)
//     .setKey(process.env.APPWRITE_API_KEY);

//   const databases = new Databases(client);

//   try {
//     console.log('🔄 Updating submission ID:', id);

//     const response = await databases.updateDocument(
//       process.env.APPWRITE_DATABASE_ID,
//       process.env.APPWRITE_COLLECTION_ID,
//       id,
//       {
//         full_name: full_name || null,
//         email: email || null,
//         selected_product: selected_product || null,
//         phone: phone || null,
//         address: address || null,
//       }
//     );

//     return res.json({ message: 'Update successful', data: response }, 200);
//   } catch (error) {
//     console.error('❌ Appwrite update error:', error.message);
//     return res.json({ error: error.message }, 500);
//   }
// };