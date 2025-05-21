// const { createClient } = require("@supabase/supabase-js");

// exports.handler = async function (event, context) {
//   console.log("▶️ getSubmissions triggered");

//   const supabaseUrl = process.env.SUPABASE_URL;
//   const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

//   if (!supabaseUrl || !supabaseKey) {
//     console.error("❌ Missing environment variables");
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Missing Supabase credentials" }),
//     };
//   }

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   try {
//     const { data, error } = await supabase.from("submissions").select("*");

//     if (error) {
//       console.error("❌ Supabase Error:", error.message);
//       return {
//         statusCode: 500,
//         body: JSON.stringify({ error: error.message }),
//       };
//     }

//     console.log("✅ Data fetched:", data);
//     return {
//       statusCode: 200,
//       body: JSON.stringify(data),
//     };
//   } catch (err) {
//     console.error("❌ Unexpected Error:", err.message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Function failed unexpectedly" }),
//     };
//   }
// };


// const sdk = require('node-appwrite');

// exports.handler = async function (event, context) {
//   const client = new sdk.Client()
//     .setEndpoint(process.env.APPWRITE_ENDPOINT)
//     .setProject(process.env.APPWRITE_PROJECT_ID)
//     .setKey(process.env.APPWRITE_API_KEY);

//   const database = new sdk.Databases(client);

//   try {
//     const response = await database.listDocuments(
//       process.env.APPWRITE_DATABASE_ID,
//       process.env.APPWRITE_COLLECTION_ID
//     );

//     return {
//       statusCode: 200,
//       body: JSON.stringify(response.documents),
//     };
//   } catch (error) {
//     console.error('Appwrite Error:', error.message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message }),
//     };
//   }
// };
