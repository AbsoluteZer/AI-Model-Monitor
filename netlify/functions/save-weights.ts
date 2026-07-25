import { Handler } from '@netlify/functions';
import { getDataset, saveDataset } from './utils/storage';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const dataset = await getDataset();

    dataset.weights = {
      ...dataset.weights,
      ...body,
    };

    dataset.logs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: 'Scoring weights updated via API.',
      source: 'UserPreferences',
    });

    await saveDataset(dataset);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, weights: dataset.weights }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err?.message || 'Failed to save weights' }),
    };
  }
};
