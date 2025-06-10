const sdk = require("node-appwrite");
const Busboy = require("busboy");

exports.handler = async function (event) {
  return new Promise((resolve) => {
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new sdk.Storage(client);

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    const busboy = new Busboy({ headers: { 'content-type': contentType } });

    let oldFileId = null;
    const fileChunks = [];
    let fileReceived = false;

    busboy.on("file", (_fieldname, file, filename) => {
      console.log("📦 Receiving file:", filename);
      fileReceived = true;

      file.on("data", (chunk) => {
        fileChunks.push(chunk);
      });

      file.on("end", () => {
        console.log("✅ File fully received:", filename);
      });
    });

    busboy.on("field", (fieldname, val) => {
      if (fieldname === "oldFileId") {
        oldFileId = val;
      }
    });

    busboy.on("finish", async () => {
      try {
        if (!fileReceived || fileChunks.length === 0) {
          return resolve({
            statusCode: 400,
            body: JSON.stringify({ error: "File not found in payload" }),
          });
        }

        const buffer = Buffer.concat(fileChunks);
        const uploaded = await storage.createFile(
          "683e80fc0019228a6dfa", // your actual bucket ID
          sdk.ID.unique(),
          buffer
        );

        if (oldFileId) {
          try {
            await storage.deleteFile("683e80fc0019228a6dfa", oldFileId);
            console.log("🗑️ Deleted old file:", oldFileId);
          } catch (err) {
            console.warn("⚠️ Failed to delete old file:", err.message);
          }
        }

        return resolve({
          statusCode: 200,
          body: JSON.stringify({ fileId: uploaded.$id }),
        });
      } catch (err) {
        console.error("❌ Upload failed:", err.message);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: err.message }),
        });
      }
    });

    try {
      const buffer = Buffer.from(event.body, "base64");
      busboy.end(buffer);
    } catch (e) {
      return resolve({
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request body" }),
      });
    }
  });
};
