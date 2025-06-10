const sdk = require("node-appwrite");
const Busboy = require("busboy");

exports.handler = async (event) => {
  return new Promise((resolve, reject) => {
    // Appwrite client
    const client = new sdk.Client()
      .setEndpoint("https://appwrite.appunik-team.com/v1")
      .setProject("68271c3c000854f08575")
      .setKey("standard_c1538acc84a7b3b527c2dd68b5f50f4232202104f4400f3c0479d2e941cf8d9ca2d2827976f42fd3a6b8c4decade4b764c1d7950329fdf6ad0f6f5dd17d277db95d66a656d7a8afefddce8cb2dd2ccf72c5410cd78e0e0d1b96043de3267fc268e6811131cc3255c1ad9ae872f8dcd62ca107c0deb2487cf63c2feb236ad9846");

    const storage = new sdk.Storage(client);

    const fileChunks = [];
    let oldFileId = null;
    let fileFound = false;

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];

    if (!contentType?.includes('multipart/form-data')) {
      return resolve({
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid Content-Type' }),
      });
    }

    const busboy = new Busboy({ headers: { 'content-type': contentType } });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log(`📦 Receiving file: ${filename}`);
      fileFound = true;

      file.on("data", (data) => {
        fileChunks.push(data);
      });

      file.on("end", () => {
        console.log(`✅ File received: ${filename}`);
      });
    });

    busboy.on("field", (fieldname, value) => {
      if (fieldname === "oldFileId") {
        oldFileId = value;
      }
    });

    busboy.on("finish", async () => {
      try {
        const fileBuffer = Buffer.concat(fileChunks);

        if (!fileFound || fileBuffer.length === 0) {
          return resolve({
            statusCode: 400,
            body: JSON.stringify({ error: "File not found in payload" }),
          });
        }

        const result = await storage.createFile(
          "683e80fc0019228a6dfa",
          sdk.ID.unique(),
          fileBuffer
        );

        if (oldFileId) {
          try {
            await storage.deleteFile("683e80fc0019228a6dfa", oldFileId);
            console.log("🗑️ Old file deleted:", oldFileId);
          } catch (err) {
            console.warn("⚠️ Failed to delete old file:", err.message);
          }
        }

        resolve({
          statusCode: 200,
          body: JSON.stringify({ fileId: result.$id }),
        });
      } catch (err) {
        console.error("❌ Upload failed:", err.message);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: err.message }),
        });
      }
    });

    // 🔥 Important: decode the base64 Netlify body!
    const buffer = Buffer.from(event.body, "base64");
    busboy.end(buffer);
  });
};
