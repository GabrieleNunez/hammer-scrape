import { PuppeteerRequest, PuppeteerManager } from 'request-group-puppeteer';
import { ManipulationCore } from '../web_scraping_engine';
import { CoreNotInitializedError, CoreRequestNotCreatedError } from '../core_errors';
import * as puppeteer from 'puppeteer';

/**
 * The configuration we expect to be utilizing
 */
export interface PuppeteerManipulatingCoreConfiguration {
    sharedRequest: PuppeteerRequest | null;
}

/**
 * Default configuration options for this manipulation core
 */
export const PUPPETEER_MANIPULATING_CORE_DEFAULT: PuppeteerManipulatingCoreConfiguration = {
    sharedRequest: null,
};

export class PuppeteerManipulatingCore extends ManipulationCore<
    puppeteer.Page,
    PuppeteerManipulatingCoreConfiguration
> {
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

    public getRequest(): PuppeteerRequest {
        if (this.request !== null) {
            return this.request;
        } else {
            throw new CoreRequestNotCreatedError();
        }
    }

    public initialize(data: PuppeteerManipulatingCoreConfiguration): Promise<void> {
        return new Promise(
            async (resolve): Promise<void> => {
                if (!this.isInitialized()) {
                    if (data.sharedRequest !== null) {
                        this.request = data.sharedRequest;
                        this.manager = data.sharedRequest.getManager();
                    }

                    // as of request-group-puppeteer version 1.2.0 there is no need to worry about reinitializing the puppeteer instance
                    await this.manager.initialize();

                    if (data.sharedRequest === null) {
                        this.request = new PuppeteerRequest(this.getUrl(), this.manager);
                        await this.request.run();
                    }
                    this.initialized = true;
                }
                resolve();
            },
        );
    }
    public select(querySelector: string, value: string): Promise<void> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    await (this.request as PuppeteerRequest).getPage().select(querySelector, value);
                    resolve();
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }
    public click(querySelector: string): Promise<void> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    await (this.request as PuppeteerRequest).getPage().click(querySelector);
                    resolve();
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }

    public type(querySelector: string, value: string): Promise<void> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    await (this.request as PuppeteerRequest).getPage().type(querySelector, value);
                    resolve();
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
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
                if (this.isInitialized()) {
                    if (this.request !== null) {
                        await (this.request as PuppeteerRequest).dispose();
                        this.request = null;
                    }

                    if (this.manager !== null) {
                        await (this.manager as PuppeteerManager).dispose();
                    }

                    this.initialized = false;
                }
                resolve();
            },
        );
    }

    public getDocumentHtml(): Promise<string> {
        if (this.isInitialized()) {
            return new Promise(
                async (resolve): Promise<void> => {
                    let html: string = await this.raw().evaluate((): string => document.body.outerHTML);
                    resolve(html);
                },
            );
        } else {
            throw new CoreNotInitializedError();
        }
    }
}

export default PuppeteerManipulatingCore;
