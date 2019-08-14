import { WebScrapingEngine } from '../web_scraping_engine';
import EngineType from '../engine_type';
import EngineCoreType from '../engine_core_type';
import PuppeteerParsingCore from '../cores/puppeteer_parsing';
import PuppeteerManipulatingCore from '../cores/puppeteer_parsing';
import EngineMode from '../engine_mode';
import { EngineCannotSwitchModeError } from '../engine_errors';

export class PuppeteerEngine extends WebScrapingEngine<PuppeteerParsingCore, PuppeteerManipulatingCore> {
    protected load(): Promise<void> {
        return new Promise((resolve): void => {
            this.parsingCore = null;
            this.manipulationCore = null;
            resolve();
        });
    }
    public process(url: string): Promise<void> {
        if (this.isCorrectEngineMode(EngineMode.Idling)) {
            return new Promise(
                async (resolve): Promise<void> => {
                    this.setEngineMode(EngineMode.Loading);

                    // define our parsing core
                    let puppeterParsing: PuppeteerParsingCore = new PuppeteerParsingCore(url);
                    await puppeterParsing.initialize();
                    this.parsingCore = puppeterParsing;

                    // define our manipulating core and share our request between these cores
                    let puppeteerManipulating: PuppeteerManipulatingCore = new PuppeteerManipulatingCore(url);
                    await puppeteerManipulating.initialize({
                        sharedRequest: this.parsingCore.getRequest(),
                    });

                    this.setEngineMode(EngineMode.Idling);
                    resolve();
                },
            );
        } else {
            throw new EngineCannotSwitchModeError();
        }
    }
    public shutoff(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
