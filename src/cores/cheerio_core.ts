import { CheerioRequest } from 'request-group-cheerio';
import { ParsingCore } from '../web_scraping_engine';

interface ExpectedLoadingFields {
    header?: string;
}

export class CheerioParsingCore extends ParsingCore<CheerioStatic, ExpectedLoadingFields> {
    private request: CheerioRequest | null;
    public constructor(url: string) {
        super(url);
        this.request = null;
    }

    public dispose(): Promise<void> {
        return new Promise((resolve): void => {
            resolve();
        });
    }

    public initialize(data?: ExpectedLoadingFields): Promise<void> {
        return new Promise((resolve): void => {
            let userAgent: string | null = data && typeof data['header'] !== 'undefined' ? data.header : null;
            this.request = new CheerioRequest(this.getUrl(), userAgent);
            this.request.run().then((): void => {
                resolve();
            });
        });
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
