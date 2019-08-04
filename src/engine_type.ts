export enum EngineType {
    /**
     * Engine type can only be of one core throughout the entire usage. Useful if you are optimizing for a particular situation
     */
    Fixed = 0,
    /**
     * The engine will use both Puppeteer and Cheerio
     */
    Dynamic = 1,
}

export default EngineType;
