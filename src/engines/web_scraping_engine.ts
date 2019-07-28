import EngineMode from './engine_mode';
import EngineType from './engine_type';
import EngineCoreType from './engine_core_type';

export interface WebScrapingEngine {
    // any method that we want to relay information back should go here
    getEngineMode(): EngineMode;
    getEngineType(): EngineType;
    getEngineCoreType(): EngineCoreType;

    /**
     * Decides what mode the engine should be in.
     * The engine should only be in one mode at a time. Either Parsing or manipulating
     * @param newMode The new mode that we want to lock the engine into
     */
    setEngineMode(newMode: EngineMode): boolean;

    /**
     * Start the engine up and get ready to process what comes in
     */
    startup(): Promise<void>;

    /**
     * Processes the url while the the engine is running and doing its thing
     * @param url The url we want to target
     */
    process(url: string): Promise<void>;

    /**
     * Shut the engine off and free up any resources
     */
    shutoff(): Promise<void>;
}

/**
 * Defines the methods that should be implemented in an engine that supports manipulation
 */
export interface ManipulationEngine<PageCore> {
    /**
     * Set the value into the select element
     * @param querySelector The selector that targets the select element
     * @param value The value to attempt to set
     */
    select(querySelector: string, value: string): Promise<void>;

    /**
     * Click on the element that matches the query selector
     * @param querySelector The selector that targets the element we want to click
     */
    click(querySelector: string): Promise<void>;

    /**
     * Type a specific value into the field that can accept typing.
     * @param querySelector The element(s) that we are targeting
     * @param value The value we want to simulate typing in
     */
    type(querySelector: string, value: string): Promise<void>;

    /**
     * Gets the raw page core used for manipulating
     */
    getManipulationCore(): PageCore;
}

/**
 * Defines the methods that should be implemented in an engine that supports parsing the page
 */
export interface ParsingEngine<PageCore> {
    // getting text methods
    getText(querySelector: string): Promise<string>;
    getTextAll(querySelector: string): Promise<string[]>;

    // attribute methods
    getAttribute(querySelector: string, attributeName: string): Promise<string>;
    getAttributeAll(querySelector: string, attributeName: string): Promise<string[]>;

    // html methods
    getHtml(querySelector: string): Promise<string>;
    getHtmlAll(querySelector: string): Promise<string>;

    /**
     * Gets all the option elements that can be found in the select element mathing the query selector
     * @param querySelector The query selector that targets the select element
     */
    getSelectOptions(
        querySelector: string,
    ): Promise<
        {
            key: string;
            value: string;
        }[]
    >;

    // gets the direct page core for more advanced usage
    getParsingCore(): PageCore;
}
