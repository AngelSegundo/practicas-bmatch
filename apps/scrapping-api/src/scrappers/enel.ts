import https from "https";
import axios from "axios";
import { FileStorage } from "../data/file-storage";
import { MiningDate } from "domain/entities";

const MAIN_URL =
  "https://www.enel.cl/es/clientes/servicios-en-linea/copia-boleta.mdwedgeohl";
const DOWNLOAD_URL = MAIN_URL + ".getInvoiceB64Public.html";
const HISTORIC_URL = MAIN_URL + ".getHistoricalInvoices.html";

const requestOptions = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  method: "GET",
  url: MAIN_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export interface EnelScrapInput {
  clientId: string;
  serviceConnectionId: string;
  serviceKey: string;
}

export const enelScrap = async ({
  clientId,
  serviceConnectionId,
  serviceKey,
}: EnelScrapInput): Promise<MiningDate[]> => {
  const response = await axios<{ invoiceList: InvoiceListData[] }>(
    HISTORIC_URL,
    {
      ...requestOptions,
      params: {
        supplyCode: clientId,
        company: "CL13", // TODO: get this from the user
      },
    }
  );

  const invoices = response.data?.invoiceList ?? [];

  const downloadableInovoices = invoices.filter((invoice) => {
    return invoice.pdfLink ? true : false;
  });

  if (downloadableInovoices.length === 0) {
    return [];
  }

  const storage = new FileStorage();

  const dates = await Promise.all(
    downloadableInovoices.map(async (invoice) => {
      try {
        const response = await axios.get<{ docBase64: string }>(DOWNLOAD_URL, {
          ...requestOptions,
          params: {
            documentIdentifier: invoice.pdfLink,
          },
        });
  
        const [, month, year] = invoice.issueDate.split("/");
        const { invoiceNumber } = invoice;
  
        const base64 = response.data.docBase64;
  
        await storage.saveFile({
          bucket: process.env.BUCKET_NAME as string,
          file: {
            filename: `${invoiceNumber}.pdf`,
            mimeType: "application/pdf",
            buffer: Buffer.from(base64, "base64"),
            size: base64.length,
          },
          path: `electricity/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
          fileName: `${invoiceNumber}.pdf`,
        });
  
        await storage.saveFile({
          bucket: process.env.BUCKET_NAME as string,
          file: {
            filename: `${invoiceNumber}.pdf`,
            mimeType: "application/pdf",
            buffer: Buffer.from(base64, "base64"),
            size: base64.length,
          },
          path: `electricity/${serviceKey}/${serviceConnectionId}/${year}/${month}/`,
          fileName: "data.pdf",
        });
  
        return {
          month,
          year,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    })
  );
  return dates.filter((date) => date !== null) as MiningDate[];
};

interface InvoiceListData {
  invoiceNumber: string;
  pdfLink?: string;
  expiryDate: string;
  isDownloadable: string;
  issueDate: string;
  amount: string;
}
