import https from "https";
import axios from "axios";
import { MiningDate } from "domain/entities";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page } from "puppeteer";
puppeteer.use(StealthPlugin());
const MAIN_URL    = "https://www.esval.cl/personas/inicio/";
const URL_API     = 'https://ov.esval.cl/api-ov/api'



export interface EsvalScrapInput {
  clientId: string;
}

export const esvalScrap = async ({
  clientId,
}: EsvalScrapInput): Promise<MiningDate[]> => {
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );
    await page.goto(MAIN_URL,{
      waitUntil: 'networkidle2',
      timeout: 100000
  })
    await page.waitForSelector("#rutUser");
    await page.type("#rutUser", "cuentasnubisk@gmail.com");
    await page.waitForSelector("#contrasena");
    await page.type("#contrasena", "nubisk12");
    
    console.log("ingresando datos");
    
    await page.waitForSelector("#login > div > div > div > div:nth-child(2) > div.col-12.mt-1 > form > div:nth-child(5) > div > button");
    await page.click(
        "#login > div > div > div > div:nth-child(2) > div.col-12.mt-1 > form > div:nth-child(5) > div > button",
    );
    //await new Promise((r) => setTimeout(r, 25000));
    /* const tken = await new Promise<string>(async(resolve, reject) => {
      page.on("response", async (response) => {
                
        const request = response.request();
        const url = request.url();
        //console.log("Request", url);
        if (url.includes("login/login") || url.includes("UserAuth/Login") ) {
          const responseBody = await response.json();
          
          resolve(responseBody.Url);
        }
        
      });
      await page.click("#login > div > div > div > div:nth-child(2) > div.col-12.mt-1 > form > div:nth-child(5) > div > button"); 
    }); */
    const token = await getToken(page)
    //const token = tken.split("auth=")[1] as string
     /*const token = await page.evaluate(async () => {
        return sessionStorage.getItem("pandora_access_token");
    }); */
    console.log("obteniendo token");
    console.log(token);
    
    page.close();
    browser.close();

    //if(token==null) return
    /** obtiene el token de la cuenta  */
    /* const { data:login } = await axios({
        method:"post",
        url : `https://www.esval.cl/umbraco/Surface/UserAuth/Login`,
        data: {
            "rut":"",
            "email": "cuentasnubisk@gmail.com",
            "contrasena": "j+O4S2zXwnIfVZ8SvzHOAWWzSGMip9m9SEZilzhPRo7zypaevoROp0yKN9TIElvt1B9lWCMUGcPsVjC5Ztm8/Qx3iA3iVW/OZaONz000y3gmlwAPVTN5uKXjPRPOczVPkuySkeLeY6oEHZVfkOVkbToyFEIsb8tVahemR9t6QaA=",
            "code": 1
        },
        headers: {
            Accept: "application/json",
            xcodempresa: "1",
        },
    })
    //if(login.Url == undefined) return
    const token=login.Url.split("auth=")[1]
    console.log(token);
 */
    /*************************agrega cliente a la cuenta******************************/
    const { data:responseCreate } = await axios({
        method:"post",
        url : `https://ov.esval.cl/api-ov/api/Suministro/Crear`,
        data: {
            "numero":Number.parseInt(clientId),
            "relacionConLaPropiedad":"O",
            "nombre":clientId,
            "esPrincipal":false
        },
        headers: {
            Accept: "application/json",
            authorization: `Bearer ${token}`,
            xcodempresa: "1",
        },
    })

    console.log(`creado con exito ${responseCreate.data.fechaRegistro}`);

    /*************************Extrae**suministro**de**Usuario******************************/
    const { data : getSuppliesByUser } = await axios.get(
        `${URL_API}/Suministro/ObtenerSuministrosPorUsuario`,
        {
            headers: {
                Accept          : "application/json",
                authorization   : `Bearer ${token}`,
                xcodempresa     : "1",
            },
        },
    );

    console.log(getSuppliesByUser);
    

    const user = getSuppliesByUser.data.find((x:any) => x.numero==clientId)
    console.log(user);
    console.log(user.id);

    const encryptedSupplyNumber =encodeURIComponent(user.numeroSuministroEncriptado)
    console.log(encryptedSupplyNumber);

    const responseTicket = await axios.get(
            
      `${URL_API}/Factura/ObtenerDetalleFacturas`,
      {
          params: {
              NumeroSuministroEncriptado: user.numeroSuministroEncriptado,
              CantidadRegistros : 12
          },
          headers: {
              Accept        : "application/json",
              xcodempresa   : "1",
          },
      },
  );

  const resTicket = responseTicket.data.data;
  
  const nroInvoice = resTicket[0].nrodocto;
  //const nroSuministroEncript=encodeURIComponent(user.numeroSuministroEncriptado)
  const {data} = await axios.get(

      `${URL_API}/v2/Factura/ObtenerBoleta?NumeroSuministroEncriptado=${encryptedSupplyNumber}&NumeroDocumento=${nroInvoice}`,
      {
          headers: {
              Accept: "application/json",
              authorization: `Bearer ${token}`,
              xcodempresa: "1",
          },
      },
  );
  const dataResponse : TicketEsval = data.data[0]

  const readingsRaw = dataResponse.lecturas;

  const readings = readingsRaw.map((reading) => {
    reading.fechaevento.split("/")
    const [day, month, year] = reading.fechaevento.split("/");
    // get iso date string
    const dateString = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day ?? 1)
    ).toISOString();

    return {
      month: month.toString(),
      year: year.toString(),
      value: parseFloat(reading.consumo),
      date: dateString,
    };
  });

  return readings;
};
const getToken = async(page : Page): Promise<any>=>{    
  await new Promise((r) => setTimeout(r, 4000));
  const token = await page.evaluate(async () => {
      return sessionStorage.getItem("pandora_access_token") as string; 
  });
  
  if(token != undefined){ 
      return token;
  }else{
      return await getToken(page);
  }
}
interface TicketEsval {
  codigoerror: string;
  nroCliente : string;
  nroBoleta : string;
  codigoempresa: string;
  dvsuministro: string;
  nombre: string;
  direccion: string;
  infadicionaldir: string;
  comuna: string;
  ruta: string;
  fechadocumento: string;
  fechavencimiento: string;
  fechaultimalectura: string;
  fechapenultimalectura: string;
  fechaproximalectura: string;
  lecturaactual: string;
  lecturaanterior: string;
  consumocliente: string;
  consumogeneral: string;
  consumoafacturar: string;
  conssobreconsumo: string;
  clavelectura: string;
  numeromedidor: string;
  diametro: string;
  promediodescontable: string;
  limitesobreconsumo: string;
  consumoabonarproxfac: string;
  factorCobro: string;
  periodo: string;
  fechultimopago: string;
  montoultimopago: string;
  totalmes: string;
  saldoanterior: string;
  totalapagar: number;
  codigodebarras: string;
  tipodoc: string;
  mensajeseguridad?: any;
  lecturas: Reading[];
  tecnicos: technical[];
}

interface Reading {
  fechaevento: string;
  consumo: string;
}

interface technical {
  descripcion: string;
  unidadmedida: string;
  preciounitario: string;
  montoimpuestos: number;
  ordenimpre: string;
}