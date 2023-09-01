import axios from "axios";
import { MiningDate } from "domain/entities";
import https from "https";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { FileStorage } from "../data/file-storage";

const MAIN_URL =
  "https://www.aguasandinas.cl/web/aguasandinas/descarga-tu-boleta";

type MonthKey =
  | "ene"
  | "feb"
  | "mar"
  | "abr"
  | "may"
  | "jun"
  | "jul"
  | "ago"
  | "sep"
  | "oct"
  | "nov"
  | "dic";
const months = {
  ene: "01",
  feb: "02",
  mar: "03",
  abr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dic: "12",
};

const monthToNumer = (month: string): string => {
  return months[month as MonthKey] ?? ("unk" as string);
};

export interface AguasAndinasScrapInput {
  clientId: string;
  serviceConnectionId: string;
  serviceKey: string;
}

puppeteer.use(StealthPlugin());

export const aguasAndinasScrap = async ({
  clientId,
  serviceConnectionId,
  serviceKey,
}: AguasAndinasScrapInput): Promise<MiningDate[]> => {
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
  await page.goto(MAIN_URL);

  console.log("Waiting for page");
  await new Promise((r) => setTimeout(r, 2000));

  await page.waitForSelector("input#busqueda_n_cuenta");
  console.log("Selector de cuenta encontrado");
  await page.click("input#busqueda_n_cuenta");

  await page.waitForSelector("input#numeroCuenta");
  console.log("Esperando input de n. cuenta");
  await page.type("input#numeroCuenta", clientId);
  console.log("Introducido n. cuenta");
  await new Promise((r) => setTimeout(r, 2000));

  await page.click("div.botonera input");

  console.log("Click en boton de buscar");

  await page.waitForNetworkIdle({ timeout: 10000 });
  console.log("Esperando al segundo form para seleccionar cuenta");

  await page.waitForSelector("div#listaResuldatos form input#numeroCuenta");
  await page.click("div#listaResuldatos form input#numeroCuenta");

  await page.click("input#buscar_boletas");

  console.log("Esperando listado de boletas");
  await page.waitForSelector("table.tabla_cuentas td[data-th='PDF'] a");

  const documentNumber = await page.evaluate(
    () =>
      document.querySelector<any>(
        "table.tabla_cuentas td[data-th='Numero de cuenta']"
      ).textContent
  );

  const documentMonthStr = await page.evaluate(
    () =>
      document.querySelector<any>("table.tabla_cuentas td[data-th='Mes']")
        .textContent
  );

  console.log("Mes de la boleta", documentMonthStr);
  console.log("Numero de cuenta", documentNumber);

  const [monthStr, year] = documentMonthStr.trim().split("/");
  const month = monthToNumer(monthStr);

  return new Promise<MiningDate[]>((resolve, reject) => {
    page.on("response", async (response) => {
      const request = response.request();
      const url = request.url();
      console.log("Request", url);
      if (url.includes("validaDescargaDocumento")) {
        const responseBody = await response.json();
        const pdfUrl = responseBody.urlDocumento as string;

        console.log("downloading pdf", pdfUrl);
        const downloadResponse = await axios.get(pdfUrl, {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
          responseType: "arraybuffer",
          responseEncoding: "base64",
          headers: {
            "Content-Type": "application/pdf",
          },
        });

        const storage = new FileStorage();

        if (month !== "unk") {
          await storage.saveFile({
            bucket: process.env.BUCKET_NAME as string,
            file: {
              filename: `${documentNumber}.pdf`,
              mimeType: "application/pdf",
              buffer: Buffer.from(downloadResponse.data, "base64"),
              size: downloadResponse.data.length,
            },
            path: `water/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
            fileName: "data.pdf",
          });
        }

        await storage.saveFile({
          bucket: process.env.BUCKET_NAME as string,
          file: {
            filename: `${documentNumber}.pdf`,
            mimeType: "application/pdf",
            buffer: Buffer.from(downloadResponse.data, "base64"),
            size: downloadResponse.data.length,
          },
          path: `water/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
          fileName: `${documentNumber}.pdf`,
        });

        await browser.close();
        console.log("Browser closed");
        resolve([
          {
            month,
            year,
          },
        ]);
      }
    });

    page.click("table.tabla_cuentas td[data-th='PDF'] a");
  });
};
