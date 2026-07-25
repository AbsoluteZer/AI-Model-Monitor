import { Handler } from '@netlify/functions';
import { runCrawlerLogic } from './utils/crawlerCore';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, must-revalidate',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const triggerSource = event.queryStringParameters?.source || 'Admin Panel Manual Refresh';
    const result = await runCrawlerLogic(triggerSource);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: err?.message || 'Crawler execution error',
      }),
    };
  }
};
