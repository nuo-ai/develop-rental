// This is our Netlify Serverless Function.
// It acts as a secure and stable proxy to fetch data from Google Sheets.

// FIXED: Removed the 'require("node-fetch")' line.
// Netlify's modern runtime has a native 'fetch' function available globally.

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQbn7yO_CxvkoAZNqULlfQJYg7z0npjCltk_P9KdRINtl97P-4OQxCzjnC_xJf2BEPuUpgrSCecJNjG/pub?output=csv';

exports.handler = async (event, context) => {
  try {
    const response = await fetch(SPREADSHEET_URL);
    if (!response.ok) {
      // If Google Sheets returns an error, we forward that error.
      return {
        statusCode: response.status,
        body: `Error from Google Sheets: ${response.statusText}`,
      };
    }
    
    const data = await response.text();

    // The function must return an object with a statusCode and a body.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Access-Control-Allow-Origin': '*', // Allow any origin to access this function
      },
      body: data,
    };
  } catch (error) {
    console.error('Error inside Netlify function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'The serverless function encountered an error.' }),
    };
  }
};
