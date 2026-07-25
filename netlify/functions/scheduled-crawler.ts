import { schedule } from '@netlify/functions';
import { runCrawlerLogic } from './utils/crawlerCore';

// Scheduled to run every 3 hours: "0 */3 * * *"
export const handler = schedule('0 */3 * * *', async () => {
  console.log('[Netlify Cron] Triggering scheduled AI model crawler...');
  const result = await runCrawlerLogic('Scheduled Netlify Cron');
  console.log('[Netlify Cron] Result:', result.message);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
});
