const sdk = require('node-appwrite');

exports.handler = async function () {
  const client = new sdk.Client()
    .setEndpoint('https://appwrite.appunik-team.com/v1')
    .setProject('68271c3c000854f08575')
    .setKey('standard_c1538acc84a7b3b527c2dd68b5f50f4232202104f4400f3c0479d2e941cf8d9ca2d2827976f42fd3a6b8c4decade4b764c1d7950329fdf6ad0f6f5dd17d277db95d66a656d7a8afefddce8cb2dd2ccf72c5410cd78e0e0d1b96043de3267fc268e6811131cc3255c1ad9ae872f8dcd62ca107c0deb2487cf63c2feb236ad9846');

  const database = new sdk.Databases(client);

  try {
    const result = await database.listDocuments(
      '68271db80016565f6882',
      '68271dcf002c6797363d',
      ['$createdAt DESC']
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      body: JSON.stringify(result.documents),
    };
  } catch (error) {
    console.error('Appwrite Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
