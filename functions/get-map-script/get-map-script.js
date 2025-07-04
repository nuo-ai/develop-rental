// functions/get-map-script/get-map-script.js

/**
 * Netlify Serverless Function to securely proxy Google Maps API script requests.
 * It fetches the API key from environment variables and injects it into the script URL.
 * NEW: It now also accepts a 'libraries' query parameter to load additional libraries like 'places'.
 */
exports.handler = async (event, context) => {
  // CORRECTED: The environment variable name must match the one set in Netlify's UI.
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: 'API key is not configured on the server. Please contact the administrator.',
    };
  }

  // 从前端请求中获取回调函数名和需要加载的库
  const callback = event.queryStringParameters.callback || 'initMap';
  const libraries = event.queryStringParameters.libraries;

  // 构建安全的 Google Maps API URL
  let googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callback}&v=weekly&language=zh-CN`;

  // 如果前端请求了额外的库 (例如 'places')，就将其附加到 URL 上
  if (libraries) {
    googleMapsUrl += `&libraries=${libraries}`;
  }

  try {
    // 返回一个302重定向指令
    return {
      statusCode: 302,
      headers: {
        'Location': googleMapsUrl,
        'Cache-Control': 'private, max-age=3600',
      },
      body: '',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process map script request.' }),
    };
  }
};
