/**
 * Describes the type of core that the engine supports
 */
export enum EngineCoreType {
    /**
     * This engine only has a cheerio core.
     * This means there is NO manipulation that can be done at all.
     * Pages come as they are and you cannot manipulate it. This is the fastest core hands down
     */
    Cheerio = 0,

    /**
     * This engine only has a puppeteer core.
     * With a puppeteer core you can do both reading and writing.
     * But it requires more work. This is the slowest core, but the most powerful
     */
    Puppeteer = 1,
    /**
     * This engine has both cheerio and puppeteer cores.
     * Puppeteer is used to manipulate the page.
     * Cheerio is used to parse the page.
     * This works well when you are trying to keep it simple, but is definitely not optimal
     * Performance will vary based on engine implementation
     */
    CheerioAndPuppeteer = 2,

    /**
     * Heck if I know bud. Probably shouldn't be making it unknown in the first place
     */
    Unknown = 99999999, // literally some arbitary number
}

export default EngineCoreType;
