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

    // Download Artwork
    const artworkURL = $('meta[property="twitter:image"]').attr('content');

    // Extract duration of track
    const extractedFromScriptData = extractDataFromHtmlContent($);
    const { artist, duration, createdDate } = extractedFromScriptData;

    // Return song information
    return {
      title: songTitle,
      artist: artist,
      duration: duration,
      createdDate: createdDate,
      artwork: artworkURL,
    };
  } catch (error) {
    console.error('Error: ', error);
  }
}

// Function to extract the specific <script> element from the html file
function extractDataFromHtmlContent($) {
  // Find the script tag containing the data
  const scriptContent = $('script')
    .filter((index, element) => {
      // Filter script tags containing window.__sc_hydration
      return $(element).html().includes('window.__sc_hydration');
    })
    .html();

  // extractDataFromScript(scriptContent);
  return extractDataFromScript(scriptContent);
}

// Function to extract duration data from the <script> element
function extractDataFromScript(scriptContent) {
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
      // (obj) => obj.data && obj.data.duration !== undefined
      (obj) => obj.hydratable === 'sound'
    );

    //! Instead of getting just the duration, we will get all the data using individualized functions

    let dataToExtract = {};

    const artistUserName = extractArtistUserName(objectWithData);
    const duration = extractDuration(objectWithData);
    const createdDate = extractCreatedDate(objectWithData);

    dataToExtract = {
      artist: artistUserName,
      duration: duration,
      createdDate: createdDate,
    };

    return dataToExtract;
  } catch (error) {
    console.error('Error extracting duration', error);
    return null;
  }
}
// Extract Artist name
function extractArtistUserName(obj) {
  const artistUserName = obj?.data?.user?.username;
  throwPropertyError(artistUserName);
  return artistUserName;
}

// Extract the duration
function extractDuration(obj) {
  const duration = obj?.data?.duration;
  throwPropertyError(duration);
  return duration;
}

// Extract the created at date
function extractCreatedDate(obj) {
  const createdDate = obj?.data?.created_at;
  throwPropertyError(createdDate);
  return createdDate;
}

// Don't repeat yourself! A function for throwing errors when extracting object values
function throwPropertyError(key) {
  if (key === undefined) {
    throw new Error(`${key} not found in the JSON data`);
  }
}
// Example usage
const soundCloudURL = 'https://soundcloud.com/joelle_illanna/dhwav'; // A dope Desert Hearts mix

scrapeSoundCloud(soundCloudURL)
  .then((songInfo) => console.log('Song information:', songInfo))
  .catch((error) => console.error('Error:', error));
