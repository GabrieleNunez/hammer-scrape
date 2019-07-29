import { CheerioRequest } from 'request-group-cheerio';
import { ParsingCore } from '../web_scraping_engine';

interface ExpectedLoadingFields {
    url: string;
}

export class CheerioParsingCore extends ParsingCore<CheerioStatic, ExpectedLoadingFields> {
    public dispose(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public initialize(data: ExpectedLoadingFields): Promise<void> {
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
    public getHtmlAll(querySelector: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    public getSelectOptions(querySelector: string): Promise<{ key: string; value: string }[]> {
        throw new Error('Method not implemented.');
    }
    public raw(): CheerioStatic {
        throw new Error('Method not implemented.');
    }
}
