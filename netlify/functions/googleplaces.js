const axios = require('axios');

exports.handler = async (event, context) => {
  const query = event.queryStringParameters.input; // The address input from the frontend
  const apiKey = 'AIzaSyBbS6eSDvhvJ_bSiX-urMEXKGkg4MSpVRE'; // Your Google API key

  console.log('Received query:', query);

  try {
    // Make multiple requests to get comprehensive suggestions
    const requests = [
      // Address suggestions
      axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          input: query,
          types: 'address',
          key: apiKey,
          components: 'country:US',
        },
      }),
      // Establishment suggestions (businesses, places with names/numbers)
      axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          input: query,
          types: 'establishment',
          key: apiKey,
          components: 'country:US',
        },
      }),
      // Geocoding suggestions (for specific addresses with numbers)
      axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          input: query,
          types: 'geocode',
          key: apiKey,
          components: 'country:US',
        },
      }),
    ];

    // Execute all requests in parallel
    const responses = await Promise.all(requests);
    
    // Combine all predictions and remove duplicates
    const allPredictions = [];
    const seenPlaceIds = new Set();
    
    responses.forEach(response => {
      if (response.data && response.data.predictions) {
        response.data.predictions.forEach(prediction => {
          if (!seenPlaceIds.has(prediction.place_id)) {
            seenPlaceIds.add(prediction.place_id);
            allPredictions.push(prediction);
          }
        });
      }
    });

    // Sort predictions by relevance (Google's internal ranking is usually good)
    // But prioritize exact matches with numbers at the beginning
    const sortedPredictions = allPredictions.sort((a, b) => {
      const aHasNumber = /^\d/.test(a.description);
      const bHasNumber = /^\d/.test(b.description);
      
      if (aHasNumber && !bHasNumber) return -1;
      if (!aHasNumber && bHasNumber) return 1;
      
      // If both have numbers or both don't have numbers, keep original order
      return 0;
    });

    // Log the combined response for debugging
    console.log('Combined API response:', {
      status: 'OK',
      predictions: sortedPredictions.slice(0, 10) // Limit to top 10 results
    });

    // Return the combined response to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'OK',
        predictions: sortedPredictions.slice(0, 10) // Limit to top 10 results
      }),
    };
  } catch (error) {
    console.error('Error fetching Google API data:', error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error fetching Google API data", 
        error: error.message 
      }),
    };
  }
};