const puppeteer = require('puppeteer');

const request = async function (url) {
    //const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
        args: ['--no-sandbox',  '--disable-dev-shm-usage'],
      });

    const page = await browser.newPage();
    await page.goto(url);
    page.waitForNavigation({waitUntil: 'networkidle2'})

    const pageContent = await page.evaluate(() => {
        return { 
            content: document.querySelector('*').outerHTML
        };
    });

    await browser.close();

    return pageContent;
}

module.exports = {
    request: request
};