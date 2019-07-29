import { CheerioRequest } from 'request-group-cheerio';
import { ParsingCore } from '../web_scraping_engine';
import { CoreNotInitializedError } from 'core_errors';

interface ExpectedLoadingFields {
    header?: string;
}

export class CheerioParsingCore extends ParsingCore<CheerioStatic, ExpectedLoadingFields> {
    private request: CheerioRequest | null;
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

    public initialize(data?: ExpectedLoadingFields): Promise<void> {
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

    public raw(): CheerioStatic {
        if (this.isInitialized()) {
            return this.core as CheerioStatic;
        } else {
            throw new CoreNotInitializedError();
        }
    }
}
