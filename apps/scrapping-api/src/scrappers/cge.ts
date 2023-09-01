import puppeteer from "puppeteer-extra";
import { MiningDate } from "domain/entities";
import { resolvePageCaptcha } from "../utils/recaptcha";
// import { FileStorage } from "../data/file-storage";
// import { ElementHandle } from "puppeteer";

const MAIN_URL =
  "https://oficinavirtual.cge.cl/OVCGE.WebApp/BoletasDesagrupadas.aspx";
const SITE_KEY = "6Ldp3wsTAAAAAPmUNSMWLuTk3q9ZM7DO0qEefpzS";

export interface CGEScrapInput {
  clientId: string;
  serviceConnectionId: string;
  serviceKey: string;
}

export const CGEScrap = async ({
  clientId,
}: CGEScrapInput): Promise<MiningDate[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  console.log("Navigating to main page");
  await page.goto(MAIN_URL);

  await page.waitForSelector("#txtNroCliente");
  await page.type("#txtNroCliente", `${clientId}`);

  await resolvePageCaptcha({
    siteKey: SITE_KEY,
    pageUrl: MAIN_URL,
    page,
    browser,
  });

  await page.click("#btnBuscar");
  await new Promise((r) => setTimeout(r, 2000));
  const validateModal = await page.$(".modal-dialog");

  if (validateModal) {
    try {
      await page.waitForSelector(".bootstrap-dialog-message");
      const typeError = await page.$eval(
        ".bootstrap-dialog-message",
        (div) => div.textContent
      );
      console.error(typeError);
      browser.close();
    } catch (e) {
      console.error(e);
    }
    browser.close();
    throw new Error("Error al buscar cliente");
  }

  const rawReading: {
    date: string;
    kwh: number;
    // link: ElementHandle<Element>;
  }[] = await page.evaluate(async () => {
    const dates = Array.from(
      document.querySelectorAll(
        "#gvwListaCuentas > tbody > tr > td:nth-child(1)"
      ),
      (tr) => tr.textContent as string
    ).map((dateString) => {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}T00:00:00.000Z`;
    });
    const kwhs = Array.from(
      document.querySelectorAll(
        "#gvwListaCuentas > tbody > tr > td:nth-child(2)"
      ),
      (tr) => {
        const kwhString = tr.textContent;
        if (kwhString === null) return null;
        return parseInt(kwhString.replace(".", "").replace(",", "."));
      }
    ).filter((kwh) => kwh !== null) as number[];

    return dates.map((date, index) => ({
      date,
      kwh: kwhs[index],
    }));
  });

  // const links = await page.$$(
  //   "#gvwListaCuentas > tbody > tr > td:nth-child(4) > [value='Ver Detalle']"
  // );

  // const readings = rawReading.map((reading, index) => ({
  //   ...reading,
  //   // link: links[index],
  // }));

  const readings = rawReading;

  // console.log(readings);

  // // await page.setRequestInterception(true);

  // for await (const reading of readings) {
  //   const [, month, year] = reading.date.split("T")[0].split("-");
  //   // page.on("request", async (request) => {
  //   //   const headers = request.headers();
  //   //   headers["ContentDisposition"] = "inline";
  //   //   request.continue({ headers });
  //   // });

  //   page.on("response", async (response) => {
  //     const request = response.request();
  //     const url = request.url();
  //     console.log("Request", url);
  //     if (url.includes("BoletasDesagrupadas")) {
  //       const storage = new FileStorage();
  //       try {
  //         const buffer = await response.buffer();

  //         await storage.saveFile({
  //           bucket: process.env.BUCKET_NAME as string,
  //           file: {
  //             filename: `data.pdf`,
  //             mimeType: "application/pdf",
  //             buffer: buffer,
  //             size: buffer.byteLength,
  //           },
  //           path: `electricity/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
  //           fileName: "data.pdf",
  //         });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //   });

  //   await reading.link.click();
  //   await new Promise((r) => setTimeout(r, 2000));
  // }

  //page.close();
  browser.close();
  return readings.map((reading) => ({
    month: reading.date.split("T")[0].split("-")[1],
    year: reading.date.split("T")[0].split("-")[0],
    value: reading.kwh,
    date: reading.date,
  }));
};
