const puppeteer = require('puppeteer');
const path = require('path');

async function downloadReport(page, companyName) {
    const url = `https://research.contrary.com/reports/${companyName}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    const pdfPath = path.join('/Users/harshu/DownloadScipt', `${companyName}.pdf`);
    await page.pdf({ path: pdfPath, format: 'A4' });
}

async function downloadReports(companyNames) {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome Dev.app/Contents/MacOS/Google Chrome Dev' 
    });
    const [page] = await browser.pages();
    await page.setViewport({ width: 1500, height: 768 });

    for (let companyName of companyNames) {
        console.log(` ${companyName} report download successfully done.`);
        try {
            await downloadReport(page, companyName);
            
        } catch (error) {
            console.error(`Error occurred with ${companyName}:`, error);
        }
    }

    await browser.close();
}

const companyNames = ["1password", 'zepto'];
downloadReports(companyNames);
