const sdk = require("node-appwrite");
const Busboy = require("busboy");

exports.handler = async (event, context) => {
  console.log("Received event:", event);  // Debugging: log the incoming event

  return new Promise((resolve, reject) => {
    const client = new sdk.Client()
      .setEndpoint("https://appwrite.appunik-team.com/v1")
      .setProject("68271c3c000854f08575") // Appwrite Project ID
      .setKey("standard_c1538acc84a7b3b527c2dd68b5f50f4232202104f4400f3c0479d2e941cf8d9ca2d2827976f42fd3a6b8c4decade4b764c1d7950329fdf6ad0f6f5dd17d277db95d66a656d7a8afefddce8cb2dd2ccf72c5410cd78e0e0d1b96043de3267fc268e6811131cc3255c1ad9ae872f8dcd62ca107c0deb2487cf63c2feb236ad9846"); // Appwrite API Key

    const storage = new sdk.Storage(client);

    const busboy = new Busboy({ headers: event.headers });

    let uploadData = null; // Buffer for the uploaded file
    let fileName = null; // Store the file name
    let mimeType = null; // Store the MIME type

    busboy.on("file", (_, file, filename, __, mime) => {
      fileName = filename;
      mimeType = mime;
      const buffer = [];

      file.on("data", (data) => buffer.push(data));  // Collect file data
      file.on("end", () => {
        uploadData = Buffer.concat(buffer); // Combine file data into a single buffer
        console.log(`File received: ${fileName}, MimeType: ${mimeType}`); // Debug log
      });
    });

    busboy.on("finish", async () => {
      try {
        if (!uploadData) {
          throw new Error("No file data received.");
        }

        console.log("Uploading file to Appwrite storage...");

        // Attempt to upload the file to Appwrite storage
        const result = await storage.createFile(
          "683e80fc0019228a6dfa", // Your Appwrite Bucket ID
          sdk.ID.unique(), // Unique ID for the file
          uploadData // File data (Buffer)
        );

        console.log("File uploaded successfully. File ID:", result.$id);

        resolve({
          statusCode: 200,
          body: JSON.stringify({ fileId: result.$id }), // Return the file ID
        });
      } catch (error) {
        console.error("File upload failed:", error); // Log the error
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: error.message || "Unknown error occurred." }),
        });
      }
    });

    busboy.end(Buffer.from(event.body, "base64")); // Parse the incoming base64-encoded file data
  });
};
