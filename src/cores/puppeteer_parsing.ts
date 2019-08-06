import { PuppeteerRequest, PuppeteerManager } from 'request-group-puppeteer';
import { ParsingCore } from '../web_scraping_engine';
import { CoreNotInitializedError, CoreError } from '../core_errors';
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

    public constructor(url: string) {
        super(url);
        this.request = null;
        this.initialized = false;
        this.manager = new PuppeteerManager({
            width: 1920,
            height: 1080,
        });
    }

    private isInitialized(): boolean {
        return this.initialized;
    }

    public initialize(data: PuppeteerParsingCoreConfiguration): Promise<void> {
        return new Promise(
            async (resolve): Promise<void> => {
                await this.manager.initialize();
                resolve();
            },
        );
    }

    public getText(querySelector: string): Promise<string> {
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
    }

    public getTextAll(querySelector: string): Promise<string[]> {
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
    }

    public getAttribute(querySelector: string, attributeName: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    public getAttributeAll(querySelector: string, attributeName: string): Promise<string[]> {
        throw new Error('Method not implemented.');
    }
    public getHtml(querySelector: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    public getHtmlAll(querySelector: string): Promise<string[]> {
        throw new Error('Method not implemented.');
    }
    public elementExist(querySelector: string): Promise<boolean> {
        throw new Error('Method not implemented.');
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
