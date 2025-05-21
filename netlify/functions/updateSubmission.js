// const { createClient } = require("@supabase/supabase-js");

// exports.handler = async function (event, context) {
//   if (event.httpMethod !== "POST") {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ error: "Method not allowed" }),
//     };
//   }

//   const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_SERVICE_ROLE_KEY  // ✅ must use service role key
//   );

//   const body = JSON.parse(event.body);

//   const { id, full_name, email, selected_product, phone, address } = body;

//   if (!id) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ error: "Missing ID" }),
//     };
//   }

//   console.log("🔄 Updating submission ID:", id);

//   const { error } = await supabase
//     .from("submissions")
//     .update({
//       full_name,
//       email,
//       selected_product,
//       phone,
//       address,
//     })
//     .eq("id", id);

//   if (error) {
//     console.error("❌ Supabase update error:", error.message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message }),
//     };
//   }

//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: "Update successful" }),
//   };
// };


const { Client, Databases } = require('node-appwrite');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  const { id, full_name, email, selected_product, phone, address } = JSON.parse(req.body);

  if (!id) {
    return res.json({ error: 'Missing ID' }, 400);
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT) // e.g., 'https://cloud.appwrite.io/v1'
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    console.log('🔄 Updating submission ID:', id);

    const response = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      id,
      {
        full_name: full_name || null,
        email: email || null,
        selected_product: selected_product || null,
        phone: phone || null,
        address: address || null,
      }
    );

    return res.json({ message: 'Update successful', data: response }, 200);
  } catch (error) {
    console.error('❌ Appwrite update error:', error.message);
    return res.json({ error: error.message }, 500);
  }
};