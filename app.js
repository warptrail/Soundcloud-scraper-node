const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeSoundCloud(url) {
  try {
    // Fetch the url
    // const response = await axios.get(url);

    // Temporary Read the html file
    const htmlContent = fs.readFileSync('url_data.html', 'utf8');

    // Load from axios
    // const $ = cheerio.load(response.data);

    // Load from htmlContent
    const $ = cheerio.load(htmlContent);

    // Extract song information
    const songTitle = $('meta[property="og:title"]').attr('content');
    const artistName = $('meta[property="twitter:audio:artist_name"]').attr(
      'content'
    );

    // Download Artwork
    const artworkURL = $('meta[property="twitter:image"]').attr('content');

    // Extract duration of track
    const duration = extractDurationFromFile($);

    // Return song information
    return {
      title: songTitle,
      artist: artistName,
      artwork: artworkURL,
      duration: duration,
    };
  } catch (error) {
    console.error('Error: ', error);
  }
}

// Function to extract the specific <script> element from the html file
function extractDurationFromFile($) {
  // Find the script tag containing the data
  const scriptContent = $('script')
    .filter((index, element) => {
      // Filter script tags containing window.__sc_hydration
      return $(element).html().includes('window.__sc_hydration');
    })
    .html();

  // extractDurationFromScript(scriptContent);
  return extractDurationFromScript(scriptContent);
}

// Function to extract duration data from the <script> element
function extractDurationFromScript(scriptContent) {
  try {
    // Remove non-ASCII characters
    // const cleanedScriptContent = scriptContent.replace(/[^\x00-\x7F]/g, '');

    // Remove prefix
    const prefixToRemove = 'window.__sc_hydration = ';
    if (scriptContent.startsWith(prefixToRemove)) {
      scriptContent = scriptContent.slice(prefixToRemove.length);
    }

    // Remove trailing semicolon
    if (scriptContent.endsWith(';')) {
      scriptContent = scriptContent.slice(0, -1);
    }

    // Parse the data as JSON
    const parsedData = JSON.parse(scriptContent);

    // Find the object with the duration nested within the "data" object
    const objectWithData = parsedData.find(
      (obj) => obj.data && obj.data.duration !== undefined
    );

    // Extract the duration using optional chaining
    const duration = objectWithData?.data?.duration;

    if (duration === undefined) {
      throw new Error('Duration not found in the JSON data.');
    }
    // return duration;
    return duration;
  } catch (error) {
    console.error('Error extracting duration', error);
    return null;
  }
}

// Example usage
const soundCloudURL = 'https://soundcloud.com/joelle_illanna/dhwav'; // A dope Desert Hearts mix

scrapeSoundCloud(soundCloudURL)
  .then((songInfo) => console.log('Song information:', songInfo))
  .catch((error) => console.error('Error:', error));
