import EngineMode from './engine_mode';
import EngineType from './engine_type';
import EngineCoreType from './engine_core_type';

/**
 * A standardized abstract class that represents what we want in our web scraping engines.
 */
export abstract class WebScrapingEngine {
    private readonly engineType: EngineType;
    private readonly engineCore: EngineCoreType;
    private engineMode: EngineMode;

    /**
     * Construct our basic implementation of our engine
     * @param engineType The type of engine we are aiming for
     * @param engineCoreType The core type that we want to utilize
     */
    public constructor(engineType: EngineType, engineCoreType: EngineCoreType) {
        this.engineType = engineType;
        this.engineCore = engineCoreType;
        this.engineMode = EngineMode.Off;
    }

    // any method that we want to relay information back should go here
    /**
     * Gets the engine mode that represents
     */
    public getEngineMode(): EngineMode {
        return this.engineMode;
    }

    /**
     * Gets the engine type that best represents this engine
     */
    public getEngineType(): EngineType {
        return this.engineType;
    }

    /**
     * Gets the core types associated with this engine
     */
    public getEngineCoreType(): EngineCoreType {
        return this.engineCore;
    }

    /**
     * Determine if the engine is currently running or not.
     */
    public isRunning(): boolean {
        return this.engineMode != EngineMode.Off;
    }

    /**
     * Decides what mode the engine should be in.
     * The engine should only be in one mode at a time. Either Parsing or manipulating
     * @param newMode The new mode that we want to lock the engine into
     */
    public setEngineMode(newMode: EngineMode): void {
        this.engineMode = newMode;
    }

    /**
     * Determines if the engine is in the current mode
     * @param targetMode The mode we are expecting to be in
     */
    protected isCorrectEngineMode(targetMode: EngineMode): boolean {
        return this.engineMode === targetMode;
    }

    /**
     * Load things into the engine. This is automatically called by this.startup
     */
    protected abstract load(): Promise<void>;

    /**
     * Start the engine up and get ready to process what comes in
     */
    public startup(): Promise<void> {
        return new Promise(
            async (resolve): Promise<void> => {
                if (this.isCorrectEngineMode(EngineMode.Off) === false) {
                    // switch to loading mode and then load anything we have to load in
                    this.setEngineMode(EngineMode.Loading);
                    await this.load();

                    // switch to idling mode and then we should be off to the races
                    this.setEngineMode(EngineMode.Idling);

                    resolve();
                } else {
                    // if we are already started up just simply resolve. No need to complain
                    resolve();
                }
            },
        );
    }

    /**
     * Processes the url while the the engine is running and doing its thing
     * @param url The url we want to target
     */
    public abstract process(url: string): Promise<void>;

    /**
     * Shut the engine off and free up any resources
     */
    public abstract shutoff(): Promise<void>;
}

export interface Core<PageType, ExpectedInitializeObjectType> {
    getUrl(): string;
    raw(): PageType;
    initialize(data: ExpectedInitializeObjectType): Promise<void>;
    dispose(): Promise<void>;
}

/**
 * Defines the methods that should be implemented in a core that handles manipulation
 */
export abstract class ManipulationCore<PageType, ExpectedInitializeObjectType>
    implements Core<PageType, ExpectedInitializeObjectType> {
    /** This core provides methods to actually manipulate the page. But it can be null if the core has not been initialized yet */
    protected core: PageType | null;
    private url: string;

    public constructor(url: string) {
        this.core = null;
        this.url = url;
    }

    public getUrl(): string {
        return this.url;
    }

    /**
     * Initialize and load in anything for the core
     * @param data Based on what was specified with the manipulation core design, this data allows us to properly initialize whatever core design we want
     */
    public abstract initialize(data: ExpectedInitializeObjectType): Promise<void>;

    /**
     * Set the value into the select element
     * @param querySelector The selector that targets the select element
     * @param value The value to attempt to set
     */
    public abstract select(querySelector: string, value: string): Promise<void>;

    /**
     * Click on the element that matches the query selector
     * @param querySelector The selector that targets the element we want to click
     */
    public abstract click(querySelector: string): Promise<void>;

    /**
     * Type a specific value into the field that can accept typing.
     * @param querySelector The element(s) that we are targeting
     * @param value The value we want to simulate typing in
     */
    public abstract type(querySelector: string, value: string): Promise<void>;

    /**
     * Gets the raw page access method used for manipulating
     */
    public abstract raw(): PageType;

    /** Frees up any resources */
    public abstract dispose(): Promise<void>;
}

/**
 * Defines the methods that should be implemented in an engine that supports parsing the page
 */
export abstract class ParsingCore<PageType, ExpectedInitializeObjectType>
    implements Core<PageType, ExpectedInitializeObjectType> {
    /** This core provides methods to actually manipulate the page. But it can be null if the core has not been initialized yet */
    protected core: PageType | null;
    private url: string;

    public constructor(url: string) {
        this.core = null;
        this.url = url;
    }

    public getUrl(): string {
        return this.url;
    }

    /**
     * Initialize and load in anything for the core
     * @param data Based on what was specified with the manipulation core design, this data allows us to properly initialize whatever core design we want
     */
    public abstract initialize(data: ExpectedInitializeObjectType): Promise<void>;

    // getting text methods
    public abstract getText(querySelector: string): Promise<string>;
    public abstract getTextAll(querySelector: string): Promise<string[]>;

    // attribute methods
    public abstract getAttribute(querySelector: string, attributeName: string): Promise<string>;
    public abstract getAttributeAll(querySelector: string, attributeName: string): Promise<string[]>;

    // html methods
    public abstract getHtml(querySelector: string): Promise<string>;
    public abstract getHtmlAll(querySelector: string): Promise<string[]>;

    /**
     * Gets all the option elements that can be found in the select element mathing the query selector
     * @param querySelector The query selector that targets the select element
     */
    public abstract getSelectOptions(
        querySelector: string,
    ): Promise<
        {
            key: string;
            value: string;
        }[]
    >;

    // gets the direct page core for more advanced usage
    public abstract raw(): PageType;

    /** Frees up any resources */
    public abstract dispose(): Promise<void>;
}

export default WebScrapingEngine;
