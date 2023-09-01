import { MiningDate } from "domain/entities";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

const MAIN_URL =
  "https://sucursal.lipigas.cl/app_sucursal/frontend/usuarios/login?";

export interface LipigasScrapInput {
  clientId: string;
  password: string;
}

puppeteer.use(StealthPlugin());

export const lipigasScrap = async ({
  clientId,
  password,
}: LipigasScrapInput): Promise<MiningDate[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  page.setDefaultTimeout(100000);

  console.log("Navigating to main page");
  await page.goto(MAIN_URL, {
    waitUntil: "networkidle2",
    timeout: 50000,
  });

  await page.type("input#rut", `${clientId}`);
  await new Promise((r) => setTimeout(r, 2000));
  await page.type("#clave", password, { delay: 100 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.click(
    "div.row.m-top-50 > div > div:nth-child(2) > div > form > div > button"
  );
  await new Promise((r) => setTimeout(r, 2000));

  await page.waitForSelector("table tr:nth-child(1) > td:nth-child(2)");
  await page.waitForSelector("table tr:nth-child(2) > td:nth-child(2)");
  await page.waitForSelector("table tr:nth-child(3) > td:nth-child(2)");

  const miningDates = await new Promise<MiningDate[]>((resolve, reject) => {
    page.on("response", async (response) => {
      const request = response.request();
      const url = request.url();

      if (url.includes("dashboard_consumo_historico")) {
        type ConsumptionResponse = {
          content: { name: number; data: number[] }[];
          status: string;
        };
        const responseBody: ConsumptionResponse = await response.json();

        const readings = responseBody.content.reduce(
          (acc, item) => {
            const { name, data } = item;
            const year = name.toString();
            const values = data.map((value, index) => {
              const month = index > 9 ? `${index + 1}` : `0${index + 1}`;
              const dateString = new Date(
                parseInt(year),
                parseInt(month) - 1,
                1
              ).toISOString();
              return {
                month,
                year,
                value,
                date: dateString,
              };
            });
            return [...acc, ...values];
          },
          [] as {
            month: string;
            year: string;
            value: number;
            date: string;
          }[]
        );
        resolve(readings);
      }
    });
  });
  await browser.close();
  return miningDates;
};
