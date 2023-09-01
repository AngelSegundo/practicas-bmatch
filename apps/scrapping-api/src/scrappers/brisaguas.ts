import https from "https";
import axios from "axios";
import parse from "node-html-parser";
import { FileStorage } from "../data/file-storage";
import { MiningDate } from "domain/entities";

const MAIN_URL = "https://brisaguas.cl/consulta_boleta_detalle.php";
const URL_Download_Pdf = "https://brisaguas.cl/";

const requestOptions = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  method: "POST",
  url: MAIN_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export interface BrisaguasScrapInput {
  clientId: string;
  serviceConnectionId: string;
  serviceKey: string;
}

export const brisaguasScrap = async ({
  clientId,
  serviceConnectionId,
  serviceKey,
}: BrisaguasScrapInput): Promise<MiningDate[]> => {
  const response = await axios<string>(
    `${MAIN_URL}?id_servicio=${clientId}`,
    requestOptions
  );
  const html = response.data;

  const dom = parse(html);

  const invoiceNodes = dom.querySelectorAll("tr.int04 a");
  const invoiceDateNodes = dom.querySelectorAll("tr.int04 td:nth-child(2)");
  const invoiceNodesArray = Array.from(invoiceNodes);
  const invoiceDateNodesArray = Array.from(invoiceDateNodes);
  const invoicesLinks: string[] = invoiceNodesArray
    .map((node) => node.getAttribute("href") as string)
    .filter((link) => link !== undefined);

  const invoicesDates: string[] = invoiceDateNodesArray.map(
    (element) => element.innerText
  );
  const storage = new FileStorage();

  const dates = (await Promise.all(
    invoicesLinks.map((invoiceLink, index) => {
      // wait random time to avoid being blocked
      const randomTime = Math.floor(Math.random() * 10000);
      const invoiceNumber = invoiceLink.split("no_doc=")[1];
      return new Promise((resolve) => {
        setTimeout(async () => {
          const response = await axios.get(
            `${URL_Download_Pdf}${invoiceLink}`,
            {
              httpsAgent: new https.Agent({
                rejectUnauthorized: false,
              }),
              responseType: "arraybuffer",
              responseEncoding: "base64",
              headers: {
                "Content-Type": "application/pdf",
              },
            }
          );

          const invoiceDate = invoicesDates[index];

          // get month and year from date
          const month = invoiceDate.split("/")[1];
          const year = invoiceDate.split("/")[2];

          await storage.saveFile({
            bucket: process.env.BUCKET_NAME as string,
            file: {
              filename: `${invoiceNumber}.pdf`,
              mimeType: "application/pdf",
              buffer: Buffer.from(response.data, "base64"),
              size: response.data.length,
            },
            path: `water/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
            fileName: `${invoiceNumber}.pdf`,
          });

          await storage.saveFile({
            bucket: process.env.BUCKET_NAME as string,
            file: {
              filename: `${invoiceNumber}.pdf`,
              mimeType: "application/pdf",
              buffer: Buffer.from(response.data, "base64"),
              size: response.data.length,
            },
            path: `water/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
            fileName: "data.pdf",
          });

          resolve({ month, year });
        }, randomTime);
      });
    })
  )) as MiningDate[];

  return dates;
};
