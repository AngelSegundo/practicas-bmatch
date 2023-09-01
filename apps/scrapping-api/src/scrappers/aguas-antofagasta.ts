import axios from "axios";
import parse from "node-html-parser";
import { MiningDate } from "domain/entities";
const MAIN_URL  = "https://www.aguasantofagasta.cl/web/prepagina/php/funciones/listado_boletas.php?instal=";

export interface AguasAntofagastaScrapInput {
    clientId: string;
  }

export const aguasAntofagastaScrap = async ({
    clientId,
  }: AguasAntofagastaScrapInput): Promise<MiningDate[]> => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const {data : PAGE_HTML } = await axios.get(
        `${MAIN_URL}${clientId}`,
        {
            headers: {Accept: "application/json"},
        },
    );
    const dom = parse (PAGE_HTML)
    
    const consumptionNode = dom.querySelectorAll("#instalaciones tr > td:nth-child(4)")
    const consumptionArray = Array.from(consumptionNode);
    const consumptions: string[] = consumptionArray.map((node) => node.textContent as string)
    //console.log(consumptions);
    
    const billingDateNode = dom.querySelectorAll("#instalaciones tr > td:nth-child(3)")
    const billingDateArray = Array.from(billingDateNode);
    const billingDate: string[] = billingDateArray.map((node) => node.textContent as string)
    //console.log(billingDate);

    if(consumptions.length == 0){

        console.log(`no se encontro el cliente ${clientId}`);
        throw new Error(`Client ${clientId} not found`);
    }
    return consumptions.map((consumption, index) =>{
        const [day,month, year] = billingDate[index].split("/")
        return {
            month,
            year,
            value: parseFloat(consumption),
          }
    })
    

}