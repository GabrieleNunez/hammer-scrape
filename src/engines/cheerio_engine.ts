import { CheerioRequest } from 'request-group-cheerio';
import { WebScrapingEngine } from '../web_scraping_engine';
import EngineType from '../engine_type';
import EngineCoreType from '../engine_core_type';

export class CheerioEngine extends WebScrapingEngine {
    public constructor() {
        super(EngineType.Fixed, EngineCoreType.Cheerio);
    }

    protected load(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public process(url: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public shutoff(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default CheerioEngine;
