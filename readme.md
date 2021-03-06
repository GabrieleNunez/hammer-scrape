# Hammer Scrape

Let's be honest here, web scraping isn't an art form. It's literally hitting the internet with a hammer. Do yourself a favor, if you can use a site provided REST API to automate actions or gather your data, then do so. Your code base will thank you. 

## BUT WAIT I DON'T HAVE THAT LUXURY!

Great news, you've found a great library to simplify the process of parsing and automating actions on web pages then. Thanks to *Cheerio* and *Puppeteer* I've developed a streamlined library to take much of that pain away. 

- - - -

## Installing
```bash
npm install hammer-scrape
```

- - - -

## How does it work?

This library works by breaking the work down by using what I call "cores" to handle the boilerplate and abstract away much of the functionality needed. From there it's up to the core to implement using whatever method they want to handle things such as querying the document or by manipulating the web page. Currently you can find three cores inside this library

* *CheerioParsing*
* *PuppeteerParsing*
* *PuppeteerManipulate*

Cores are extensible and you can develop your own using other frameworks such as Nightmare if that is your preferred. Each of these cores power what I call an "engine". An engine is made up of a parsing core and a manipulating core if possible. In this library you will find three different engines

* *CheerioEngine:* Uses cheerio for parsing, but has no manipulation compabilities
* *PuppeteerEngine:* parsing and page manipulation done by Puppeteer
* *HammerEngine:* uses both cheerio and puppeteer to provide a fast parser but with page maniuplation methods via puppeteer

More often then not the most used engine will be the HammerEngine, followed by the cheerio engine. I've included puppeteer just for the sake of completness. However everything PuppeteerEngine can do, HammerEngine can do. Anything CheerioEngine can do, HammerEngine can do. But you do have a choice if you have a preference regardless, and like the cores, you can always extend WebScrapingEngine to implement your own. 

# Why use Hammer over PuppeteerEngine

The key is how hammer works, the HammerEngine implementation will first attempt to use Cheerio to parse the document and look for what I call a "peek/ping selector". If it can find this selector it will use cheerio to parse out the document and when its time to manipulate the page it will create a puppeteer request. This form of "lazy loading" so to speak makes the startup time much easier and lighter on resources additionally.  If the selector is not found, a puppeteer instance will be launched and shared between the cores. 

- - - -

## Example using Hammer

```typescript
import HammerEngine from 'hammer-scrape';

function main(): Promise<void> {
    return new Promise(
        async (resolve): Promise<void> => {
            console.time('Hammer benchmark');
            console.log('Starting up engine');
            let engine: HammerEngine = new HammerEngine('table.files tr.js-navigation-item td.content span a');
            await engine.startup();

            console.log('Now processing hammer scrape repository');
            await engine.process('https://github.com/GabrieleNunez/hammer-scrape');

            // our goal is to scrape the file names from this repository
            let files: string[] = [];

            // parse the engine and grab the data
            console.log('Parsing page');
            await engine.parse(
                (core): Promise<void> => {
                    return new Promise(
                        async (resolve): Promise<void> => {
                            files = await core.getTextAll('table.files tr.js-navigation-item td.content span a');
                            resolve();
                        },
                    );
                },
            );

            console.log('Top directory files');
            console.log(files);

            console.log('Shutting engine off');
            await engine.shutoff();
            console.timeEnd('Hammer benchmark');
            resolve();
        },
    );
}

main().then((): void => {
    console.log('Completed');
});

```


## Can Hammer Scrape parse websites that are dynamic?

YES! This portion is powered by Puppeteer. if the peek/ping selector cannot be found a Puppeteer instance will be created thatway you can use a headless browser to interface with the site. All element manipulations are doing using puppeteer. If you are using the  CheerioEngine you cannot manipulate a page, thats the nature of cheerio. Its a parser not a manipulation method. Puppeteer can handle both


## You support Cheerio, can you load xml documents in? 

The capability is there, but the implementation is not hooked in at this moment. This will come very soon in the next minor build