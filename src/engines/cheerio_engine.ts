import { WebScrapingEngine } from '../web_scraping_engine';
import EngineType from '../engine_type';
import EngineCoreType from '../engine_core_type';
import CheerioParsingCore from '../cores/cheerio_parsing';
import EngineMode from '../engine_mode';
import { EngineCannotSwitchModeError } from '../engine_errors';

export class CheerioEngine extends WebScrapingEngine<CheerioParsingCore, null> {
    public constructor() {
        super(EngineType.Fixed, EngineCoreType.Cheerio);
    }

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
                    let cheerioCore: CheerioParsingCore = new CheerioParsingCore(url);
                    await cheerioCore.initialize({
                        xml: false,
                        header: undefined,
                    });
                    this.parsingCore = cheerioCore;
                    this.setEngineMode(EngineMode.Idling);
                    resolve();
                },
            );
        } else {
            throw new EngineCannotSwitchModeError();
        }
    }

    public shutoff(): Promise<void> {
        return new Promise((resolve): void => {
            this.setEngineMode(EngineMode.Off);
            resolve();
        });
    }
}

export default CheerioEngine;
