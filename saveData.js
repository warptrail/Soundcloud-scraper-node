const axios = require('axios');
const fs = require('fs');

async function fetchAndSaveUrlData(url, outputPath) {
  try {
    // Make an HTTP GET request to fetch a file
    const response = await axios.get(url);

    // Save the response data to a text file
    fs.writeFileSync(outputPath, response.data);

    console.log('Track data saved to: ', outputPath);
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
}

// Example usage
const url =
  'https://podcasts.apple.com/us/podcast/the-culture-war-podcast-with-tim-pool/id1674019695?i=1000621178906'; // Any URL
const outputPath = 'podcast_url_data.txt'; // Path to save the data

fetchAndSaveUrlData(url, outputPath);
