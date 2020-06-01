const uri = "https://www.depop.com/search/?q=nike%20dunk%20sb%20travis%20scott%20uk";
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(uri);

  const priceList = await page.evaluate(() => {
    // Get a list of all the a elements on the page from the given URL
    var x = Array.from(document.querySelectorAll('a'), element => element.textContent)
    // For the array of prices, get the ones that are in GBP -> strip away symbols -> strip away nulls
    x = x.filter(x => x.includes('£')).map(x => parseInt(x.replace('£', ''))).filter(x => x)
    // Get average of all of these prices
    let firstPass = x.reduce((a,b) => a+b, 0) / x.length
    // Get rid of all crazy high prices that may not be represented properly
    x = x.filter(x => x < firstPass)
    // Get new average of these prices
    let secondPass = x.reduce((a,b) => a + b, 0) / x.length
    // Return this average
    return secondPass.toFixed(2)
});
  console.log(priceList);
  browser.close();
})();

