import { CheerioRequest } from 'request-group-cheerio';
import { ParsingCore } from '../web_scraping_engine';
import { CoreNotInitializedError } from '../core_errors';

/**
 * The fields we expect to pass into our intitialize method.
 */
export interface CheerioParsingCoreConfiguration {
    header?: string;
    xml?: boolean;
    reinitialize?: boolean;
    html?: string;
}

/**
 * A set of default configuration options to use for the cheerio parsing core
 */
export const CHEERIO_PARSING_CORE_DEFAULT: CheerioParsingCoreConfiguration = {
    xml: false,
    header: undefined,
    reinitialize: false,
    html: '',
};

/**
 * A basic cheerio parsing core.
 * This is very likely the fasest core for parsing that's reliable
 */
export class CheerioParsingCore extends ParsingCore<CheerioStatic, CheerioParsingCoreConfiguration> {
    // the request that we are intending to make with this core.  Can be null if not initialized
    private request: CheerioRequest | null;

    // holds a boolean value that should be set to true when this core is initialized
    private initialized: boolean;

    public constructor(url: string) {
        super(url);
        this.request = null;
        this.initialized = false;
    }

    public dispose(): Promise<void> {
        return new Promise((resolve): void => {
            this.initialized = false;
            resolve();
        });
    }

    public getRequest(): CheerioRequest {
        if (this.isInitialized()) {
            return this.request as CheerioRequest;
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public initialize(data: CheerioParsingCoreConfiguration = CHEERIO_PARSING_CORE_DEFAULT): Promise<void> {
        return new Promise((resolve): void => {
            if (this.isInitialized()) {
                resolve();
            } else {
                let userAgent: string | null = data && typeof data['header'] !== 'undefined' ? data.header : null;
                this.request = new CheerioRequest(this.getUrl(), userAgent);
                this.request.run().then((): void => {
                    this.core = (this.request as CheerioRequest).getPage();
                    this.initialized = true;
                    resolve();
                });
            }
        });
    }

    private isInitialized(): boolean {
        return this.initialized;
    }

    public getText(querySelector: string): Promise<string> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let result: string = this.raw()(querySelector)
                    .first()
                    .text()
                    .trim();
                resolve(result);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getTextAll(querySelector: string): Promise<string[]> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let result: string[] = [];
                let $: CheerioStatic = this.raw();
                $(querySelector).each((index: number, element: CheerioElement): void => {
                    result.push(
                        $(element)
                            .text()
                            .trim(),
                    );
                });
                resolve(result);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getAttribute(querySelector: string, attributeName: string): Promise<string> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let result: string = this.raw()(querySelector)
                    .first()
                    .attr(attributeName)
                    .trim();
                resolve(result);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getAttributeAll(querySelector: string, attributeName: string): Promise<string[]> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let results: string[] = [];
                let $: CheerioStatic = this.raw();
                $(querySelector).each((index: number, element: CheerioElement): void => {
                    results.push(
                        $(element)
                            .attr(attributeName)
                            .trim(),
                    );
                });
                resolve(results);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getHtml(querySelector: string): Promise<string> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let html: string | null = this.raw()(querySelector)
                    .first()
                    .html();

                let result: string = html ? html.trim() : '';
                resolve(result);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getHtmlAll(querySelector: string): Promise<string[]> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let results: string[] = [];
                let $: CheerioStatic = this.raw();
                $(querySelector).each((index: number, element: CheerioElement): void => {
                    let html: string | null = $(element).html();
                    results.push(html ? html.trim() : '');
                });
                resolve(results);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getSelectOptions(querySelector: string): Promise<{ text: string; value: string }[]> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let selectOptions: { text: string; value: string }[] = [];
                let $: CheerioStatic = this.raw();
                $(querySelector)
                    .find(querySelector)
                    .each((index: number, element: CheerioElement): void => {
                        selectOptions.push({
                            text: $(element)
                                .text()
                                .trim(),
                            value: $(element).val(),
                        });
                    });
                resolve(selectOptions);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public elementExist(querySelector: string): Promise<boolean> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                this.elementCount(querySelector).then((totalCount: number): void => {
                    resolve(totalCount > 0 ? true : false);
                });
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public elementCount(querySelector: string): Promise<number> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let totalCount: number = this.raw()(querySelector).length;
                resolve(totalCount);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public raw(): CheerioStatic {
        if (this.isInitialized()) {
            return this.core as CheerioStatic;
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getDocumentHtml(): Promise<string> {
        if (this.isInitialized()) {
            return new Promise((resolve): void => {
                let html: string = this.raw()
                    .root()
                    .html() as string;
                resolve(html);
            });
        } else {
            throw new CoreNotInitializedError();
        }
    }
}

export default CheerioParsingCore;
