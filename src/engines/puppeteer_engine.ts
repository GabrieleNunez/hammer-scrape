import { WebScrapingEngine } from '../web_scraping_engine';
import EngineType from '../engine_type';
import EngineCoreType from '../engine_core_type';
import PuppeteerParsingCore from '../cores/puppeteer_parsing';
import PuppeteerManipulatingCore from '../cores/puppeteer_parsing';
import EngineMode from '../engine_mode';
import { EngineCannotSwitchModeError } from '../engine_errors';

export class PuppeteerEngine extends WebScrapingEngine<PuppeteerParsingCore, PuppeteerManipulatingCore> {
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
