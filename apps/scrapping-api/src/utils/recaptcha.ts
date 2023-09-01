import { Solver } from "2captcha";
import { Page, Browser } from "puppeteer";

// pasar a env
const captchaSolver = new Solver("095f33cbd73f719f0b96f2b36dc473af");

export async function resolvePageCaptcha({
  siteKey,
  pageUrl,
  page,
  browser,
}: {
  siteKey: string;
  pageUrl: string;
  page: Page;
  browser: Browser;
}) {
  try {
    const response = await captchaSolver.recaptcha(siteKey, pageUrl);

    if (response.data === "") {
      throw new Error("Captcha response is empty");
    }

    await page.evaluate(
      `document.getElementById("g-recaptcha-response").innerHTML="${response.data}";`
    );
    console.log("Captcha resolved");
  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error("Error while solving captcha");
  }
}
