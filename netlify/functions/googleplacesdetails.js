const axios = require('axios');

exports.handler = async (event, context) => {
  const placeId = event.queryStringParameters.place_id; // The place_id received from the frontend

  const apiKey = 'AIzaSyBbS6eSDvhvJ_bSiX-urMEXKGkg4MSpVRE'; // Your Google API key

  console.log('Received place_id:', placeId);

  try {
    // Request detailed place information from the Google Places API
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: apiKey,
      },
    });

    const placeDetails = response.data.result;

    if (placeDetails) {
      console.log('Place details:', placeDetails);

      return {
        statusCode: 200,
        body: JSON.stringify({
          result: placeDetails,
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Place not found' }),
      };
    }
  } catch (error) {
    console.error('Error fetching place details:', error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching place details',
        error: error.message,
      }),
    };
  }
};
