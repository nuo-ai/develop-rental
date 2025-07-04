// functions/get-directions/get-directions.js

/**
 * Netlify Serverless Function to securely fetch travel directions from Google Maps API.
 * It acts as a secure proxy, using an API key stored in environment variables.
 */

exports.handler = async (event, context) => {
  // 1. 从 Netlify 环境变量中安全地获取 API 密钥
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key is not configured.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key is not configured on the server.' }),
    };
  }

  // 2. 从前端请求的查询参数中获取起点、终点和交通方式
  const { origin, destination, mode } = event.queryStringParameters;

  if (!origin || !destination || !mode) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ error: 'Missing required parameters: origin, destination, and mode are required.' }),
    };
  }

  // 3. 构建 Google Directions API 的请求 URL
  const googleApiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode.toLowerCase()}&key=${apiKey}&language=zh-CN`;

  try {
    // 4. 发起对 Google API 的请求
    const response = await fetch(googleApiUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      // 如果 Google API 返回错误（例如，找不到地址）
      console.error('Google Directions API Error:', data.error_message || data.status);
      return {
        statusCode: 404, // Not Found or other appropriate error
        body: JSON.stringify({ error: `Could not find directions. Reason: ${data.status}` }),
      };
    }

    // 5. 从返回的数据中提取我们需要的信息
    const route = data.routes[0].legs[0];
    const result = {
      distance: route.distance.text, // 例如 "8.2 km"
      duration: route.duration.text, // 例如 "15 分钟"
    };

    // 6. 将处理好的结果返回给前端
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
      },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Error fetching directions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};
