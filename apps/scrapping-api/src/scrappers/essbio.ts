
import https from "https";
import { MiningDate } from "domain/entities";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { FileStorage } from "../data/file-storage";
import { ElementHandle } from "puppeteer";
import axios from "axios";

const MAIN_URL = "https://www.essbio.cl";

export interface EssbioScrapInput {
  clientId: string;
  password: string;
}

interface responseInvoice{
  Fecfac: string,
  detalle: string,
  Lectura: number,
  Consumo: number,
  Totbol: string
}

puppeteer.use(StealthPlugin());




export const essbioScrap = async ({
  clientId,
  password
}: EssbioScrapInput): Promise<MiningDate[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );
  page.setDefaultTimeout(100000);
  await page.goto(MAIN_URL, {
    waitUntil: 'networkidle2',
    timeout: 50000
  });
  await page.waitForSelector("#rutIndex")
  await page.type("#rutIndex", `${clientId}`);
  console.log("ingresando usuario");
  
  await page.waitForSelector("#passwordIndex")
  await page.type("#passwordIndex", `${password}`);
  console.log("ingresando password");
  await page.click("#dataLoginIndexForm > button")
  await new Promise((r) => setTimeout(r, 6000));
  await page.click("#pagos-tab")
  await new Promise((r) => setTimeout(r, 3000));
  await page.click("#facturacion-historica-collapsed")
  await new Promise((r) => setTimeout(r, 3000));
  await page.click("#dataFacturacionHistorica > form > div > div > button > div > div > div")
  await new Promise((r) => setTimeout(r, 3000));

  const responseInvoice:responseInvoice[] = await new Promise<any>((resolve, reject):any => {
    page.on("response", async (response) => {
      const request = response.request();
      const url = request.url();
      if (url.includes("getDatos/facturacion")) {
        resolve(await response.json());
      }
    });
    page.click("#bs-select-8-1")
  });
  //console.log(responseInvoice);
  const miningDates: MiningDate[] = responseInvoice.map((response)=>{
      const {Fecfac, Consumo} = response
      const [month,year ] = Fecfac.split("/")
    return{
      month,
      year,
      value:Consumo
    }
  }); 
  await browser.close();
  //filter dates to avoid duplicates
  console.log("Invoices", miningDates);

  return miningDates;
};
