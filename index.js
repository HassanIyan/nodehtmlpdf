const puppeteer = require('puppeteer');
const express = require('express')
const fs = require('fs')
const app = express()

app.get('/pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const website_url = `https://${req.query.url}`; 
        await page.goto(website_url, { waitUntil: 'networkidle0' }); 
        await page.emulateMediaType('screen');
        const pdf = await page.pdf({
            path: `pdfs/${req.query.url}.pdf`,
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: true,
            format: 'A4',
        });
        await browser.close();
        const data = fs.readFileSync(`./pdfs/${req.query.url}.pdf`);
        res.contentType("application/pdf");
        return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send("failed")
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});