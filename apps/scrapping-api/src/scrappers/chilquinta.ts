import { MiningDate } from "domain/entities";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

const MAIN_URL = "https://www.chilquinta.cl/";

export interface chilquintaScrapInput {
  clientId: string; 
  invoiceId: string; // numero de la boleta ultimos 6 meses
}

puppeteer.use(StealthPlugin());

export const chilquintaScrap = async ({
  clientId,
  invoiceId,
}: chilquintaScrapInput): Promise<chilquintaMiningDate> => {
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


  await page.waitForSelector("#__layout div.card-body.rounded.animated.fadeIn.fast.p-0 > div:nth-child(1) > div:nth-child(3) a");

    await page.click("#__layout div.card-body.rounded.animated.fadeIn.fast.p-0 > div:nth-child(1) > div:nth-child(3) a")
    console.log("selecciona detalle boleta");

    await page.waitForSelector("input.input-sv.form-control");
    
    const [inputclientId, inputInvoiceId] =await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("input.input-sv.form-control"),
        (x) => x.id as string
      )
    );
    console.log(inputclientId, inputInvoiceId);
    
    await new Promise((r) => setTimeout(r, 2000));

    await page.type(`#${inputclientId}`, `${clientId}`);

    console.log("ingresa nro cliente", clientId);
    await new Promise((r) => setTimeout(r, 2000));


    await page.type(`#${inputInvoiceId}`, `${invoiceId}`);
    console.log("ingresa nro boleta", invoiceId);
 
    const lastInvoiceNumber = await new Promise<string>((resolve, reject) => {
      page.on("response", async (response) => {
      const request = response.request();
      const url = request.url();
      //console.log(url);
      
      if (url.includes("invoice/detail/")) {
 

          const {detailInvoice}:responseData = await response.json();
          
          const consumptionItem = detailInvoice.items.find((x)=>x.receivable.includes("Electricidad consumida"))
          const consumption= Number.parseInt(consumptionItem?.energyPot||"0")
          //const lastInvoiceNumber = detailInvoice.currentDetail.invoiceNumber // ticket_id 

          //console.log(lastInvoiceNumber);
          //ticket.consumption = Number.parseInt(consumption)        // consumo en khw
          /* ticket.client_id = detailInvoice.currentDetail.productId     // client_id
          
          ticket.ticket_id = detailInvoice.currentDetail.invoiceNumber // ticket_id  
          ticket.issued_date = detailInvoice.currentDetail.emittedDate   // emision boleta
          ticket.due_date = detailInvoice.currentDetail.finishDate    // vencimiento
          const consumptionItem = detailInvoice.items.find((x)=>x.receivable.includes("Electricidad consumida"))
          const consumption= consumptionItem?.energyPot||"0"
          ticket.consumption = Number.parseInt(consumption)        // consumo en khw
          ticket.total_month = detailInvoice.totals.amountCurrent // total_mount 
          ticket.total_amount = detailInvoice.totals.toPay        // total_amount 
          */
          resolve(detailInvoice.currentDetail.invoiceNumber);
      }
      });
      page.click("#__layout div:nth-child(3) div.card-body > div > div > div > div > div > button");
    });

    console.log("click a btn ingresar");
    await new Promise((r) => setTimeout(r, 5000));

    await page.waitForSelector("#__layout div.text-font-12.container > div.div-chilquinta.mt-4 > div > div.mt-5.col-md-10.offset-md-1.col-12 a:nth-child(2)");
    const conditions = await page.$("#__layout div.text-font-12.container > div.div-chilquinta.mt-4 > div > div.mt-5.col-md-10.offset-md-1.col-12 a:nth-child(3)");

    await page.evaluate(
      (btnSelector) => {
        if(document.querySelector(btnSelector) !=null)
        {
          document.querySelector<any>(btnSelector).click()
        }
      },
      conditions == undefined
        ? "#__layout div.text-font-12.container > div.div-chilquinta.mt-4 > div > div.mt-5.col-md-10.offset-md-1.col-12 a:nth-child(2)"
        : "#__layout div.text-font-12.container > div.div-chilquinta.mt-4 > div > div.mt-5.col-md-10.offset-md-1.col-12 a:nth-child(3)"
    );
    console.log("ingresa en historial boltas emitidas");
    
    await page.waitForSelector("#__layout div:nth-child(1) > div.text-right.text-md-left.col-md-4.col-12 > a")
    
    const miningDate = await new Promise<MiningDate[]>(async(resolve, reject) => {
      page.on("response", async (response) => {  
        const request = response.request();
        const url = request.url();
        
        if (url.includes("/consumos/inyectado/totales?cn_meses=")) {
          const {result}:responseConsumption = await response.json();

          const readings = result.map((reading)=>{
            const year = reading.cd_mes_ano.slice(0,4)
            const month = reading.cd_mes_ano.slice(4,6)
            return{
              year,
              month,
              value:Number.parseInt(reading.cn_consumo)
            }
          }  
          )
          
          resolve(readings);
        }
      });
      await page.click("#__layout div:nth-child(1) > div.text-right.text-md-left.col-md-4.col-12 > a")
    });

    await browser.close();

  await browser.close();
  return {
    lastInvoiceNumber: lastInvoiceNumber,
    MiningDate:miningDate
  };
};

interface chilquintaMiningDate{
  lastInvoiceNumber : string
  MiningDate:MiningDate[]
}

interface responseData {
  detailInvoice: DetailInvoice;
}

interface DetailInvoice {
  currentDetail: CurrentDetail;
  items:         Item[];
  totals:        Totals;
}

interface CurrentDetail {
  emittedDate:   string;
  finishDate:    string;
  invoiceNumber: string;
  productId:     string;
  typeDocument:  string;
  pdfUrl:        string;
  tariff:        string;
}

interface Item {
  receivable: string;
  amount:     string;
  energyPot:  string;
  detail:     Detail;
}

interface Detail {
  amountUnTax:  string;
  amountExempt: string;
  tax:          string;
  amountTotal:  string;
}

interface Totals {
  amountCurrent: number;
  amountExempt:  number;
  taxCurrent:    number;
  amountBefore:  number;
  amountTotal:   number;
  toPay:         number;
}

//tabla de los consumos 12 meses
interface Result {
  cd_mes_ano: string;
  cn_consumo: string;
  vl_consumo: string;
}
// respuesta de la peticion del historial de consumo
interface responseConsumption {
  result: Result[];
  CodMsg: number;
  TxtMsg: string;
}


