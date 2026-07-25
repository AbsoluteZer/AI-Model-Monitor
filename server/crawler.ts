import { runCrawlerLogic } from '../netlify/functions/utils/crawlerCore';

export class CrawlerService {
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startScheduler();
  }

  public startScheduler() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
    const THREE_HOURS = 3 * 60 * 60 * 1000;
    this.intervalTimer = setInterval(() => {
      this.runCrawler('Express Background Scheduler');
    }, THREE_HOURS);
  }

  public async runCrawler(triggerSource: string = 'Manual Request') {
    return await runCrawlerLogic(triggerSource);
  }
}

export const crawler = new CrawlerService();
