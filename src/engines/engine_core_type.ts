/**
 * Describes the type of core that the engine supports
 */
export enum EngineCoreType {
    /**
     * This engine only has a cheerio core
     */
    Cheerio = 0,
    /**
     * This engine only has a puppeteer core
     */
    Puppeteer = 1,
    /**
     * This engine has both cheerio and puppeteer cores
     */
    CheerioAndPuppeteer = 2,
    Unknown = 99999999, // literally some arbitary number
}

export default EngineCoreType;
