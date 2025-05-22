// const sdk = require("node-appwrite");

// exports.handler = async function () {
//   try {
//     const client = new sdk.Client()
//       .setEndpoint("https://appwrite.appunik-team.com/v1")
//       .setProject("68271c3c000854f08575")
//       .setKey("standard_c1538acc84a7b3b527c2dd68b5f50f4232202104f4400f3c0479d2e941cf8d9ca2d2827976f42fd3a6b8c4decade4b764c1d7950329fdf6ad0f6f5dd17d277db95d66a656d7a8afefddce8cb2dd2ccf72c5410cd78e0e0d1b96043de3267fc268e6811131cc3255c1ad9ae872f8dcd62ca107c0deb2487cf63c2feb236ad9846");

//     const databases = new sdk.Databases(client);
//     const Query = sdk.Query;

//     const res = await databases.listDocuments(
//       "68271db80016565f6882", // Database ID
//       "68271dcf002c6797363d", // Collection ID
//       [Query.orderDesc("$createdAt")] // Correct sorting
//     );

//     return {
//       statusCode: 200,
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//         "Cache-Control": "no-store, must-revalidate", // Disable cache
//         "Pragma": "no-cache",
//         "Expires": "0",
//       },
//       body: JSON.stringify(res.documents),
//     };
//   } catch (error) {
//     console.error("Appwrite fetch error:", error.message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message }),
//     };
//   }
// };


const sdk = require("node-appwrite");

exports.handler = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(req.body);
  } catch (error) {
    console.error('❌ JSON parse error:', error.message);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { id, full_name, email, selected_product, phone, address } = body;

  if (!id) {
    return res.status(400).json({ error: 'Missing document ID' });
  }

  try {
    const client = new sdk.Client()
      .setEndpoint("https://appwrite.appunik-team.com/v1")
      .setProject("68271c3c000854f08575")
      .setKey("standard_c1538acc84a7b3b527c2dd68b5f50f4232202104f4400f3c0479d2e941cf8d9ca2d2827976f42fd3a6b8c4decade4b764c1d7950329fdf6ad0f6f5dd17d277db95d66a656d7a8afefddce8cb2dd2ccf72c5410cd78e0e0d1b96043de3267fc268e6811131cc3255c1ad9ae872f8dcd62ca107c0deb2487cf63c2feb236ad9846");

    const databases = new sdk.Databases(client);

    const updated = await databases.updateDocument(
      "68271db80016565f6882", // Your database ID
      "68271dcf002c6797363d", // Your collection ID
      id,
      {
        full_name: full_name || null,
        email: email || null,
        selected_product: selected_product || null,
        phone: phone || null,
        address: address || null,
      }
    );

    return res.status(200).json({ message: 'Update successful', data: updated });
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
