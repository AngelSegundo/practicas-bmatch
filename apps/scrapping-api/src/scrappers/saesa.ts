import axios from "axios";
import { MiningDate } from "domain/entities";
import FormData from 'form-data';
export interface EsvalScrapInput {
    clientId: string;
  }

export const saesaScrap = async (
    {  clientId }: EsvalScrapInput,

): Promise<MiningDate[]> => {
           //obtiene el token   
           let isRegistered : boolean = false    
           let DataClient : DataClient  
           let body = new FormData();
           body.append("client_id", "86ec7c4c-82b5-4b17-ab21-f9169588ef70");
           body.append("redirect_uri", "https://autoatencion.gruposaesa.cl/");
           body.append("response_type", "token");
           body.append("showPasswordField", "true");
           body.append("loginId", "cuentasnubisk@gmail.com"); // correo de la cuenta
           body.append("password", "Nubisk12_cuenta"); // contraseña de la cuenta
           
           const {request} = await axios.request({
            url: "https://idm.gruposaesa.cl/oauth2/authorize",
            method: "POST",
            headers: {
               "Accept": "*/*",
               "upgrade-insecure-requests": "1" 
              },
            data: body,
          });
    
           const responseLogin:string =request.res.responseUrl
           const startToken = responseLogin.indexOf("#access_token=") + "#access_token=".length
           const endtToken = responseLogin.indexOf("&expires_in=")
           
           const token = responseLogin.substring(startToken,endtToken)
           // trae la data de la cuenta y el unico cliente que esta inscrito en la cuenta 
           const {data:responseUserLogin} = await axios.request<dataUserLogin[]>(
            {
                url: "https://apim.saesa.cl/inspira/perfilusuario/prd/v1/suscripciones/usuario",
                method: "GET",
                headers: {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                authorization: `Bearer ${token}`,
                "x-api-key": "9e72ffd8176f405e8d9d94ac943a6daa" 
                },
            }
          );
          
          const clientCurrentRegister = responseUserLogin[0].suscripcion.numeroServicio
          //console.log(clientCurrentRegister);
          
          if(clientCurrentRegister == clientId) {
            isRegistered = true
        }else{

           //inscribe cliente en la cuenta y devuelve informacion
           const {data:responseClient} = await axios.request<DataClient>({
            method:"post",
            url : `https://apim.saesa.cl/inspira/perfilusuario/prd/v1/suscripciones/usuario`,
            data: {
                "alias":clientId,
                "numeroServicio":clientId
            },
            headers: {
                Accept: "*/*",
                authorization: `Bearer ${token}`,
                "x-api-key": "9e72ffd8176f405e8d9d94ac943a6daa",
            },
        })
        DataClient = responseClient
        console.log("data cliente"); 
        console.log(DataClient); 
    }

        const currentYear= new Date().getFullYear()
        const lastYear= currentYear-1           
        /* 
            -la respuesta del enpoint solo devuelve valores para 2 años con este formato de ejemplo
            {
                numeroMes: 1,
                descripcionMes: 'Enero',
                energiaPeriodo1: '21.00000000000000 ',
                energiaPeriodo2: '169.00000000000000 ',
                pesosPeriodo1: '3910.00 ',
                pesosPeriodo2: '23603.00 '
            },
        */
        //obtiene el historial de este año y el anterior
        let {data: ResponseHistory}  = await axios.request<ResponseHistory>({
            url: `https://apim.saesa.cl/inspira/consumo/prd/v1/${clientId}/detalle?desde=${lastYear}&hasta=${currentYear}`,
            method: "GET",
            headers: {
            "Accept": "application/json, text/plain, */*",
            "authorization": `Bearer ${token}`,
            "x-api-key": "9e72ffd8176f405e8d9d94ac943a6daa" 
            },
        });
        console.log("historial"); 
        console.log(ResponseHistory);

        const ResponseInvoice =await getlastInvoice(currentYear,token,clientId!.toString())
        console.log("boletas");
        
        console.log(ResponseInvoice);
    if(!isRegistered){
        //elimina al cliente de la cuenta
            const {data:deleteClient} =  await axios.request({
            url: `https://apim.saesa.cl/inspira/perfilusuario/prd/v1/suscripciones/usuario/${DataClient!.id}`,
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "authorization": `Bearer ${token}`,
                "x-api-key": "9e72ffd8176f405e8d9d94ac943a6daa" 
                },
        });
        console.log("Remover cliente"); 
        console.log(deleteClient);
    }
    const [year_issued,month_issued] = ResponseInvoice.fechaEmision.split("-")

    const readings:MiningDate[]= []
    
    for (const details of ResponseHistory.detalle) {
        const month = (details.numeroMes>9)?`${details.numeroMes}`:`0${details.numeroMes}`
                                   //mm/dd/yyyy
        const date_issued = new Date(`${month_issued}/01/${year_issued}`)
        const date = new Date(`${month}/01/${currentYear}`)
        const value = (date_issued<date)?0:Number.parseInt(details.energiaPeriodo1)
        if(date_issued>=date)
        {
            readings.push({
            value,
            month,
            year: currentYear.toString()
            })
        }
    }
    ResponseHistory.detalle.map(x=>{
        const month = (x.numeroMes>9)?`${x.numeroMes}`:`0${x.numeroMes}`
                                   //mm/dd/yyyy
        const date_issued = new Date(`${month_issued}/01/${year_issued}`)
        const date = new Date(`${month}/01/${currentYear}`)
        const value = (date_issued<date)?0:Number.parseInt(x.energiaPeriodo1)
        const cm_hy : MiningDate={
            value,
            month,
            year: currentYear.toString()
        }
        
        return cm_hy
    })

    readings.push( ...ResponseHistory.detalle.map(x=>{
        const month = (x.numeroMes>9)?`${x.numeroMes}`:`0${x.numeroMes}`
        const dateString = new Date(
            parseInt(lastYear.toString()),
            parseInt(month) - 1,
            1
          ).toISOString();
          return {
            month: month.toString(),
            year: lastYear.toString(),
            value: parseFloat(x.energiaPeriodo2),
            date: dateString,
          };
    }))
    return readings;
};

const getlastInvoice = async(year:number, token: string, clientId:string):Promise<ResponseInvoice>=>
{
    const {data:ResponseInvoice} = await axios.request<ResponseInvoice[]>(
        {
            url:`https://apim.saesa.cl/inspira/facturacion/prd/v1/boletas/${clientId}/${year}`,
            method: "GET",
            headers: {
                Accept: "application/json",
                authorization: `Bearer ${token}`,
                "x-api-key": "9e72ffd8176f405e8d9d94ac943a6daa",
            },
        },
    );
    if(ResponseInvoice.length == 0){
        return getlastInvoice(year-1, token, clientId)
    }
    return  ResponseInvoice[0]
}

interface ResponseHistory {
    numeroServicio: string;
    empresa:        Company;
    detalle:        Details[];
}

interface Details {
    numeroMes:       number;
    descripcionMes:  string;
    energiaPeriodo1: string;
    energiaPeriodo2: string;
    pesosPeriodo1:   string; // 2023 año actual
    pesosPeriodo2:   string; // 2022 año anterior
}

interface Company {
    numeroEmpresa: number;
    codigoEmpresa: string;
    descripcion:   string;
}

interface DataClient {
    id: string;
    emailUsuario: string;
    numeroServicio: string;
    direccion: string;
    comuna: string;
    boletaElectronica: boolean;
    alias: string;
}

interface ResponseInvoice {
    fechaEmision: string;
    numeroBoleta: string;
    fechaVencimiento: string;
    linkPaperlessBoleta: string;
    montoBoleta: number;
    estadoPago: string;
    
}

interface suscription{
    id: string,
    emailUsuario: string,
    numeroServicio: string,
    direccion: string,
    comuna: string,
    boletaElectronica: boolean,
    alias: string
  
}
interface dataUserLogin {
estadoCorteServicio: { id: string, descripcion: string },
suscripcion: suscription,
empresa: { numeroEmpresa: number, codigoEmpresa: string, descripcion: string }
}