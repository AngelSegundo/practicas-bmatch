import axios from "axios";
import { FileStorage } from "../data/file-storage";
import { MiningDate } from "domain/entities";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page } from "puppeteer";

export interface MetrogasScrapInput {
    clientId: string;
    password: string;
    serviceConnectionId: string;
    serviceKey: string;
  }
puppeteer.use(StealthPlugin());

type MonthKey = | "ene" | "feb" | "mar" | "abr" | "may" | "jun" | "jul" | "ago" | "sep" | "oct" | "nov" | "dic";
const months = { ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06", jul: "07", ago: "08", sep: "09", oct: "10", nov: "11", dic: "12",
};
const monthToNumer = (month: string): string => {
    return months[month as MonthKey] ?? ("unk" as string);
};

const modalCssShow = "background-color: white; border-color: rgb(151, 199, 245); border-width: 8px; border-style: solid; width: 420px; position: absolute; left: 741.5px; top: 399px; z-index: 10001;"
const URL_BOLETAS = 'https://wtx.metrogas.cl/cuentasonline/www/aspx/loged/resBoletas.aspx'
export const MetrogasScrap = async ({
    clientId,
    password,
    serviceConnectionId,
    serviceKey
  }: MetrogasScrapInput): Promise<MiningDate[]> => {

    const MAIN_URL    = "https://wtx.metrogas.cl/cuentasonline/www/aspx/login/login.aspx";
    const storage = new FileStorage();
    let rut = ""
    let validator = ""
      
      if(clientId.includes("-")){
        rut = clientId.split("-")[0]
        validator = clientId.split("-")[1]
      }
      else {
        rut  = clientId.substring(0, clientId.length - 1);
        validator = clientId.substring(rut.length, clientId.length) 
      }
      
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
      await new Promise((r) => setTimeout(r, 2000));
      
      await page.type('#ContentPlaceHolder1_txRutNumero', rut);
      await page.type('#ContentPlaceHolder1_txRutDv', validator);
      await page.click('#ContentPlaceHolder1_txClave');
      console.log("login...");
      
      await new Promise((r) => setTimeout(r, 2000));

      await page.type('#ContentPlaceHolder1_txClave', password!, {delay: 100})
    
      await page.click('#ContentPlaceHolder1_btEntrar');

      await new Promise((r) => setTimeout(r, 2000));

      await skipModal(page)

      await page.waitForSelector(".link_button_grilla")
      const invoicesLinks = await page.evaluate(
          () => Array.from(
            document.querySelectorAll(".link_button_grilla"),
            a => a.getAttribute('href') as string
      ))
      console.log(invoicesLinks);
      
      //invoicesLinks s
      const invoicesNumber = await page.evaluate(
          () => Array.from(
              document.querySelectorAll(".link_button_grilla"),
              a => a.textContent as string
      ))
      const invoicesDates =  await page.evaluate(
        () => Array.from(
            document.querySelectorAll("#ContentPlaceHolder1_ContentPlaceHolderDetalle_gvConsumo > tbody td:nth-child(1)"),
            a => (a.textContent as string).split("al")[1]
            ))

      const dates = (await Promise.all(
        invoicesLinks.map((invoiceLink, index) => {
          // wait random time to avoid being blocked
          const randomTime = Math.floor(Math.random() * 10000);
          const linkNew = invoiceLink.replace('v01','depot');
          return new Promise((resolve) => {
            setTimeout(async () => {
              console.log("descargando: ", linkNew);
              
              const response = await axios.get(linkNew,{headers: {
                'Content-Length': 0,
                'Content-Type': 'text/plain'
            }})
            /* const responsePDF = await axios.get(invoiceLink,{headers: {
              'Content-Length': 0,
              'Content-Type': 'application/pdf'
            }}) */
              const invoiceDate = invoicesDates[index];
    
              // get month and year from date
              const month = monthToNumer(invoiceDate.split("-")[1]);
              const year = invoiceDate.split("-")[2];
              // para subir el pdf al storage, esta comentado porque no estoy seguro si crea bien el pdf
              /* await storage.saveFile({
                bucket: process.env.BUCKET_NAME as string,
                file: {
                  filename: `${invoicesNumber[index]}.pdf`,
                  mimeType: "application/pdf",
                  buffer: Buffer.from(responsePDF.data, "base64"),
                  size: responsePDF.data.length,
                },
                path: `gas/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
                fileName: `${invoicesNumber[index]}.pdf`,
              }); */
    
              await storage.saveFile({
                bucket: process.env.BUCKET_NAME as string,
                file: {
                  filename: `${invoicesNumber[index]}.txt`,
                  mimeType: "application/text",
                  buffer: response.data,
                  size: response.data.length,
                },
                path: `gas/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
                fileName: `${invoicesNumber[index]}.txt`,
              });
              
              await storage.saveFile({
                bucket: process.env.BUCKET_NAME as string,
                file: {
                  filename: "data.txt",
                  mimeType: "application/text",
                  buffer: response.data,
                  size: response.data.length,
                },
                path: `gas/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
                fileName: "data.txt",
              });
              resolve({ month, year });
            }, randomTime);
          });
        })
      )) as MiningDate[];
      await browser.close()
      return dates;

}

const skipModal=async(page:Page)=>{
    await page.goto(URL_BOLETAS);
    
    await page.waitForSelector("#PnModalGeneral")
    
    const modalCss = await page.evaluate(()=>document.querySelector<any>('#PnModalGeneral').getAttribute("style") as string)
    console.log(modalCss);
    
    if (modalCss==modalCssShow){
        console.log("show modal");
        await skipModal(page);
    }
    
}