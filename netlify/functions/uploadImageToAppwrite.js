const sdk = require("node-appwrite");

exports.handler = async (event) => {
  try {
    const client = new sdk.Client()
      .setEndpoint("https://appwrite.appunik-team.com/v1")
      .setProject("68271c3c000854f08575")
      .setKey("YOUR_SECRET_API_KEY"); // 🔐 Secure, keep private

    const storage = new sdk.Storage(client);
    const file = event.body && Buffer.from(event.body, 'base64');

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];

    if (!file || !contentType) {
      return { statusCode: 400, body: "Invalid file upload." };
    }

    const uploaded = await storage.createFile(
      "683e80fc0019228a6dfa",
      sdk.ID.unique(),
      file,
      contentType
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ fileId: uploaded.$id }),
    };
  } catch (err) {
    console.error("Upload error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
