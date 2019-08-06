import { PuppeteerRequest, PuppeteerManager } from 'request-group-puppeteer';
import { ParsingCore } from '../web_scraping_engine';
import { CoreNotInitializedError } from '../core_errors';
import * as puppeteer from 'puppeteer';

/**
 * The configuration we expect to be utilizing
 */
export interface PuppeteerParsingCoreConfiguration {
    reserved: unknown;
}

/**
 * Default configuration options for this parsing core
 */
export const PUPPETEER_PARSING_CORE_DEFAULT: PuppeteerParsingCoreConfiguration = {
    reserved: false,
};

export class PuppeteerParsingCore extends ParsingCore<puppeteer.Page, PuppeteerParsingCoreConfiguration> {
    private request: PuppeteerRequest | null;
    private manager: PuppeteerManager;
    private initialized: boolean;
    private reserved: unknown;

    public constructor(url: string) {
        super(url);
        this.request = null;
        this.initialized = false;
        this.manager = new PuppeteerManager({
            width: 1920,
            height: 1080,
        });
        this.reserved = null;
    }

    private isInitialized(): boolean {
        return this.initialized;
    }

    public initialize(data: PuppeteerParsingCoreConfiguration = PUPPETEER_PARSING_CORE_DEFAULT): Promise<void> {
        return new Promise(
            async (resolve): Promise<void> => {
                await this.manager.initialize();
                this.reserved = data.reserved;
                resolve();
            },
        );
    }

    public getText(querySelector: string): Promise<string> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let elementText: string = (await (this.request as PuppeteerRequest)
                        .getPage()
                        .evaluate(function(selector: string): Promise<string> {
                            return new Promise((evalResolve): void => {
                                let resultText = '';
                                let elementResult: Element | null = document.querySelector(selector);
                                if (elementResult) {
                                    resultText = elementResult.textContent ? elementResult.textContent.trim() : '';
                                } else {
                                    resultText = '';
                                }
                                evalResolve(resultText);
                            });
                        }, querySelector)) as string;
                    resolve(elementText);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getTextAll(querySelector: string): Promise<string[]> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let elementTexts: string[] = (await (this.request as PuppeteerRequest)
                        .getPage()
                        .evaluate(function(selector: string): Promise<string[]> {
                            return new Promise((evalResolve): void => {
                                let resultText: string[] = [];
                                let elements: NodeListOf<Element> | null = document.querySelectorAll(selector);
                                for (var i = 0; i < elements.length; i++) {
                                    let element: Element = elements[i];
                                    if (element.textContent && element.textContent.trim().length > 0) {
                                        resultText.push(element.textContent.trim());
                                    }
                                }
                                evalResolve(resultText);
                            });
                        }, querySelector)) as string[];
                    resolve(elementTexts);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getAttribute(querySelector: string, attributeName: string): Promise<string> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let elementAttribute: string = (await (this.request as PuppeteerRequest).getPage().evaluate(
                        function(selector: string, selectedAttribute: string): Promise<string> {
                            return new Promise((evalResolve): void => {
                                let element: Element | null = document.querySelector(querySelector);
                                let attributeVal: string =
                                    element && element.getAttribute(selectedAttribute)
                                        ? (element.getAttribute(selectedAttribute) as string)
                                        : '';
                                evalResolve(attributeVal);
                            });
                        },
                        querySelector,
                        attributeName,
                    )) as string;
                    resolve(elementAttribute);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getAttributeAll(querySelector: string, attributeName: string): Promise<string[]> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let elementAttributes: string[] = (await (this.request as PuppeteerRequest).getPage().evaluate(
                        function(selector: string, selectedAttribute: string): Promise<string[]> {
                            return new Promise((evalResolve): void => {
                                let attributeValues: string[] = [];
                                let elements: NodeListOf<Element> | null = document.querySelectorAll(querySelector);
                                for (var i = 0; i < elements.length; i++) {
                                    let element = elements[i];
                                    let attrVal = element.getAttribute(selectedAttribute)
                                        ? (element.getAttribute(selectedAttribute) as string).trim()
                                        : '';
                                    attributeValues.push(attrVal);
                                }
                                evalResolve(attributeValues);
                            });
                        },
                        querySelector,
                        attributeName,
                    )) as string[];
                    resolve(elementAttributes);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getHtml(querySelector: string): Promise<string> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let htmlVal: string = await (this.request as PuppeteerRequest)
                        .getPage()
                        .evaluate(function(selector: string): Promise<string> {
                            return new Promise(
                                async (evalResolve): Promise<void> => {
                                    let element: Element | null = document.querySelector(selector);
                                    let elementHtml = '';
                                    if (element) {
                                        elementHtml = element.outerHTML.trim();
                                    }
                                    evalResolve(elementHtml);
                                },
                            );
                        }, querySelector);

                    resolve(htmlVal);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public getHtmlAll(querySelector: string): Promise<string[]> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let htmlVal: string[] = await (this.request as PuppeteerRequest)
                        .getPage()
                        .evaluate(function(selector: string): Promise<string[]> {
                            return new Promise(
                                async (evalResolve): Promise<void> => {
                                    let elementHtmls: string[] = [];
                                    let elements: NodeListOf<Element> = document.querySelectorAll(selector);
                                    for (var i = 0; i < elements.length; i++) {
                                        let element = elements[i];
                                        elementHtmls.push(element.outerHTML);
                                    }
                                    evalResolve(elementHtmls);
                                },
                            );
                        }, querySelector);
                    resolve(htmlVal);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }
    public elementExist(querySelector: string): Promise<boolean> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let elementExist = false;
                    try {
                        // attempt to wait for the element to pop up via selector.If the timeout exceeds, it fails
                        await (this.request as PuppeteerRequest).getPage().waitForSelector(querySelector, {
                            timeout: 1000,
                        });
                        elementExist = true;
                    } catch {
                        // waiting for the selector failed. Element does not exist
                        elementExist = false;
                    }
                    resolve(elementExist);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }
    public elementCount(querySelector: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
    public getSelectOptions(querySelector: string): Promise<{ text: string; value: string }[]> {
        throw new Error('Method not implemented.');
    }
    public raw(): puppeteer.Page {
        if (this.isInitialized()) {
            return (this.request as PuppeteerRequest).getPage();
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public dispose(): Promise<void> {
        return new Promise(
            async (resolve): Promise<void> => {
                if (this.request !== null) {
                    await (this.request as PuppeteerRequest).dispose();
                    this.request = null;
                }
                await this.manager.dispose();
                resolve();
            },
        );
    }
}
