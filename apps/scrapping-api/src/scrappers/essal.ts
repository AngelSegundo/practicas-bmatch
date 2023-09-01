import fs from "fs";
import { MiningDate } from "domain/entities";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { FileStorage } from "../data/file-storage";

const MAIN_URL = "https://www.essal.cl/mi-cuenta/copia-de-cuenta";

export interface EssalScrapInput {
  clientId: string;
  serviceConnectionId: string;
  serviceKey: string;
}

puppeteer.use(StealthPlugin());

export const essalScrap = async ({
  clientId,
  serviceConnectionId,
  serviceKey,
}: EssalScrapInput): Promise<MiningDate[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "./tmp",
  });

  page.setDefaultTimeout(100000);

  console.log("Navigating to main page");
  await page.goto(MAIN_URL);

  const inputSelector =
    "input#OpensiteControlboletapago_essalascx_Uc_boletapago1_Uc_buscar1_txtServicio";

  console.log("Waiting for page");

  await page.waitForSelector(inputSelector);

  await new Promise((r) => setTimeout(r, 500));
  await page.type(inputSelector, `${clientId}`);

  await page.click(
    "input[id=OpensiteControlboletapago_essalascx_Uc_boletapago1_Uc_buscar1_btnBuscarxCliente]"
  );

  await page.waitForSelector(".itemGrilla a, .itemGrillaAlternado a");
  const links = await page.$$(".itemGrilla a, .itemGrillaAlternado a");
  const dates = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        ".itemGrilla a, .itemGrillaAlternado a"
      ),
      (a) => a.textContent
    ).reverse()
  );

  console.log("Invoices", dates);

  const downloadedDates: MiningDate[] = [];
  for await (const date of dates) {
    const index = dates.indexOf(date);
    if (!date) continue;
    try {
      await links[index].evaluate((b: any) => b.click());
      // wait 5 econds
      await new Promise((r) => setTimeout(r, 6000));
      // get iso date from date
      const [day, month, year] = date.split("-");
      const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
      downloadedDates.push({
        date: isoDate,
        month: isoDate.split("-")[1],
        year: isoDate.split("-")[0],
      });
    } catch (e) {
      console.log("Error", e);
    }
  }

  const fileStorage = new FileStorage();
  // read files from disk in local ./tmp and order them by string
  await Promise.all(
    fs.readdirSync("./tmp").map(async (filePath, index) => {
      // upload file to sotrage
      if (index >= downloadedDates.length) return;
      const file = fs.readFileSync(`./tmp/${filePath}`);
      const year = downloadedDates[index].year;
      const month = downloadedDates[index].month;
      await fileStorage.saveFile({
        bucket: process.env.BUCKET_NAME as string,
        file: {
          filename: filePath,
          mimeType: "application/pdf",
          buffer: file,
          size: file.length,
        },
        path: `water/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
        fileName: filePath,
      });
      await fileStorage.saveFile({
        bucket: process.env.BUCKET_NAME as string,
        file: {
          filename: filePath,
          mimeType: "application/pdf",
          buffer: file,
          size: file.length,
        },
        path: `water/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
        fileName: "data.pdf",
      });
    })
  );

  // delete files from disk
  fs.readdirSync("./tmp").forEach((filePath) => {
    fs.unlinkSync(`./tmp/${filePath}`);
  });

  // read the file

  return downloadedDates;
};
