const express = require('express'); 
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');
const { log } = require('console');

const app = express(); 

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');


app.get('/', (req,res) => {
    res.render("index");
});

app.post('/submit', (req,res) => {
    let userUrl = req.body['url'];
    let companyName = req.body['companyName']; 
    console.log(userUrl);
    
    async function downloadReport(page, companyName) {
        const url = `https://${userUrl}/reports/${companyName}`;
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
        await page.setViewport({ width: 1366, height: 768 });
    
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
    
    const companyNames = [companyName];
    downloadReports(companyNames);
    

}); 

app.listen(3000, () =>{
    console.log("Server started in 3000");
});