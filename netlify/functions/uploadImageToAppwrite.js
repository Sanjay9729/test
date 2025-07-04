const sdk = require("node-appwrite");
const Busboy = require("busboy");

exports.handler = async (event, context) => {
  console.log("Received event:", event);

  return new Promise((resolve, reject) => {
    // Initialize Appwrite client and storage service
    const client = new sdk.Client()
      .setEndpoint("https://appwrite.appunik-team.com/v1")
      .setProject("68271c3c000854f08575")
      .setKey("standard_c1538acc84a7b3b527c2dd68b5f50f4232202104f4400f3c0479d2e941cf8d9ca2d2827976f42fd3a6b8c4decade4b764c1d7950329fdf6ad0f6f5dd17d277db95d66a656d7a8afefddce8cb2dd2ccf72c5410cd78e0e0d1b96043de3267fc268e6811131cc3255c1ad9ae872f8dcd62ca107c0deb2487cf63c2feb236ad9846"); // Appwrite API Key

    const storage = new sdk.Storage(client);

    // Create a new Busboy instance to parse the incoming multipart data
    const busboy = new Busboy({ headers: event.headers });

    const uploadResults = []; // Array to store the result of each upload
    let fileCount = 0; // Track how many files we've processed

    // Parse the files from the request
    busboy.on("file", (_, file, filename, __, mime) => {
      fileCount++;
      let uploadData = [];
      console.log(`Received file: ${filename}, MimeType: ${mime}`);

      // Collect file data as it's streamed
      file.on("data", (data) => {
        uploadData.push(data);
      });

      file.on("end", async () => {
        try {
          // Concatenate the buffer after the file is fully uploaded
          const fileBuffer = Buffer.concat(uploadData);

          // Upload the file to Appwrite
          const result = await storage.createFile(
            "683e80fc0019228a6dfa", // Your Appwrite Bucket ID
            sdk.ID.unique(), // Generate a unique ID for the file
            fileBuffer // The file buffer data
          );

          // Store the result (file ID)
          uploadResults.push({
            success: true,
            fileName: filename,
            fileId: result.$id,
            mimeType: mime,
          });
        } catch (error) {
          // Handle individual file upload errors
          uploadResults.push({
            success: false,
            fileName: filename,
            error: error.message || "Unknown error occurred.",
          });
        }

        // Check if all files have been processed
        if (--fileCount === 0) {
          busboy.emit("finish"); // Trigger the "finish" event after all files are done
        }
      });
    });

    busboy.on("finish", () => {
      // Final response: Return results of all uploads
      if (uploadResults.length > 0) {
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            message: "File uploads completed.",
            results: uploadResults,
          }),
        });
      } else {
        resolve({
          statusCode: 400,
          body: JSON.stringify({ message: "No files were uploaded." }),
        });
      }
    });

    // Parse the body (Base64 encoded content from the request)
    busboy.end(Buffer.from(event.body, "base64"));
  });
};
