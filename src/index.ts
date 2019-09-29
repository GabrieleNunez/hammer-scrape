// our entry point into this library
export * from './engines/hammer_engine';
export * from './engines/cheerio_engine';
export * from './engines/puppeteer_engine';
export * from './cores/cheerio_parsing';
export * from './cores/puppeteer_parsing';
export * from './cores/puppeteer_manipulate';
export * from './engine_core_type';
export * from './engine_errors';
export * from './engine_mode';
export * from './engine_type';
export * from './web_scraping_engine';

// default export will be the hammer engine
import HammerEngine from './engines/hammer_engine';
import { Request, BaseWebRequest } from 'request-group';

/** Quick and Dirty hammer request
 * @todo Find a a way to share puppeteer manager instances between multiple hammer request. Right now this is really inefficiant
 */
export class HammerRequest extends BaseWebRequest<HammerEngine> {
    protected pingSelector: string;
    public constructor(url: string, pingSelector: string) {
        super(url);
        this.pingSelector = pingSelector;
    }

    public async dispose(): Promise<void> {
        if (this.pageData) {
            await this.pageData.shutoff();
            this.pageData = null;
        }
    }

    public async run(): Promise<Request<HammerEngine>> {
        if (!this.pageData) {
            this.pageData = new HammerEngine(this.pingSelector);
            await this.pageData.startup();
        }
        // process a url
        await this.pageData.process(this.getUrl());
        return this;
    }
}

export default HammerEngine;
