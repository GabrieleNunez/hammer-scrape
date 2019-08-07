import { PuppeteerRequest, PuppeteerManager } from 'request-group-puppeteer';
import { ManipulationCore } from '../web_scraping_engine';
import { CoreNotInitializedError } from '../core_errors';
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
    public initialize(data: PuppeteerManipulatingCoreConfiguration): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public select(querySelector: string, value: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public click(querySelector: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public type(querySelector: string, value: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public raw(): puppeteer.Page {
        throw new Error('Method not implemented.');
    }
    public dispose(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
