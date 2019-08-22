import { WebScrapingEngine } from '../web_scraping_engine';
import EngineType from '../engine_type';
import EngineCoreType from '../engine_core_type';
import CheerioParsingCore from '../cores/cheerio_parsing';
import PuppeteerParsingCore from '../cores/puppeteer_parsing';
import PuppeteerManipulatingCore from '../cores/puppeteer_parsing';
import EngineMode from '../engine_mode';
import { EngineCannotSwitchModeError } from '../engine_errors';

export class HammerEngine extends WebScrapingEngine<
    CheerioParsingCore | PuppeteerParsingCore,
    PuppeteerManipulatingCore
> {
    /** element ping selector */
    private elementPingSelector: string;

    /** This serves as our basic */
    public constructor(elementPingSelector: string) {
        super(EngineType.Dynamic, EngineCoreType.CheerioAndPuppeteer);
        this.elementPingSelector = elementPingSelector;
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

                    let usingPuppeteer = false;

                    // we are going to initially try to find the element we want first using cheerio.
                    // if cheerio fails to find it we will load it up using the puppeteer parsing core.
                    let cheerioParsingCore: CheerioParsingCore = new CheerioParsingCore(url);
                    await cheerioParsingCore.initialize();
                    let elementExist: boolean = await cheerioParsingCore.elementExist(this.elementPingSelector);
                    if (elementExist) {
                        this.parsingCore = cheerioParsingCore;
                    } else {
                        let puppeteerParsingCore: PuppeteerParsingCore = new PuppeteerParsingCore(url);
                        await puppeteerParsingCore.initialize();
                        usingPuppeteer = true;
                        this.parsingCore = puppeteerParsingCore;
                    }

                    // initialize our maniuplation core
                    let puppeteerManipulatingCore: PuppeteerManipulatingCore = new PuppeteerManipulatingCore(url);
                    await puppeteerManipulatingCore.initialize({
                        sharedRequest: usingPuppeteer ? (this.parsingCore as PuppeteerParsingCore).getRequest() : null,
                    });
                    this.manipulationCore = puppeteerManipulatingCore;

                    this.setEngineMode(EngineMode.Idling);
                    resolve();
                },
            );
        } else {
            throw new EngineCannotSwitchModeError();
        }
    }

    public parse<T extends PuppeteerParsingCore | CheerioParsingCore>(
        callback: (core: T) => Promise<void>,
    ): Promise<void> {
        if (this.isCorrectEngineMode(EngineMode.Idling)) {
            return new Promise((resolve): void => {
                this.setEngineMode(EngineMode.Parsing);
                callback(this.getParsingCore() as T).then((): void => {
                    this.setEngineMode(EngineMode.Idling);
                    resolve();
                });
            });
        } else {
            throw new EngineCannotSwitchModeError();
        }
    }

    public shutoff(): Promise<void> {
        return new Promise(
            async (resolve): Promise<void> => {
                if (this.parsingCore !== null) {
                    await this.parsingCore.dispose();
                    this.parsingCore = null;
                }

                if (this.manipulationCore !== null) {
                    await this.manipulationCore.dispose();
                    this.manipulationCore = null;
                }

                resolve();
            },
        );
    }
}
