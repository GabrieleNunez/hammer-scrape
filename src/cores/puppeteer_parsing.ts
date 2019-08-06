import { PuppeteerRequest } from 'request-group-puppeteer';
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
    public initialize(data: PuppeteerParsingCoreConfiguration): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public getText(querySelector: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    public getTextAll(querySelector: string): Promise<string[]> {
        throw new Error('Method not implemented.');
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
        throw new Error('Method not implemented.');
    }
    public dispose(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
