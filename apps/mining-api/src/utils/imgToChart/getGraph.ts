import { ServiceConnectionDTO, ServiceReading } from "domain/entities";
import { getServiceTypeUnit } from "domain/utilities";
import * as Jimp from "jimp";
import { parseDate } from "../dateParser";
import { RecordSizeProperties } from "./configGraphImg";

const months = ["01","02","03","04","05","06","07","08","09","10","11","12",];
//const {sizeRecord} = getRecordSizePorperties
export const getListPIxels = async (JimpRecord:Jimp) => {
    console.log("cargando imagen...");
    const { sizeRecord } = RecordSizeProperties.getInstance()
  // Carga una imagen
  let image = JimpRecord //await Jimp.read(nameImgSaveRecord);
  
  const grayPixels: pixelPosition[] = [];
  const onlyOnePixelAxisY: pixelPosition[] = [];

  image.scan(0, 0, image.bitmap.width, image.bitmap.height ,function (x, y, idx) {
      // se recorre la imagen para obtener los pixeles requeridos
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      if (
        // obtiene los pixeles gris y los guarda en una lista
        red >= 83 && red <= 160 && green >= 83 && green <= 160 && blue >= 83 && blue <= 160
      ) { 
        if(y == (sizeRecord.height-1)){
          onlyOnePixelAxisY.push({ x, y });
        }
        grayPixels.push({ x, y });
      }
   
    }
  );
  //ordena los piexeles de mayor a menos en el eje x ya que cuando recorre la imagen no vienen ordenado

  grayPixels.sort((a, b) => a.x - b.x);
  onlyOnePixelAxisY.sort((a, b) => a.x - b.x);
  return { grayPixels, onlyOnePixelAxisY }
};


export const getGraph = async (Currentconsumption: number,
   Currentmonth: string,
   CurrentYear: number, 
   graphicBase: pixelPosition[][],
   JimpRecord:Jimp,
   connection: ServiceConnectionDTO,
   serviceConnectionId: string
   ): Promise<ServiceReading[]>=> {
    const { grayPixels } =await getListPIxels(JimpRecord);
    // filtra la lista de todos los pixeles grices para ubicarlos en arreglo en base a graphicBase
    const pixelTopList: number[] = [];
    for (const barBase of graphicBase) {
      let highValue = 0
      for (const pixel of barBase) {
        const barHigh = grayPixels.filter(px=> px.x == pixel.x).length;
        if(highValue<barHigh){
          highValue = barHigh
        } 
      }
      pixelTopList.push(highValue)
    }
    //console.log("valor alturas de barras");
    //console.log(pixelTopList);

    // toma la referencia del ultimo mes para poder reducir la escala
    var reference = pixelTopList[pixelTopList.length - 1];

    // Determina el factor de reducción

    var reductionFactor = Currentconsumption / reference;

    //encuentra el mes actual
    const currentMonthPosition = months.indexOf(Currentmonth);
    // reorganiza los meses
    const ReorganizeMonths: string[] = ([] = [
      ...months.slice(currentMonthPosition),
      ...months.slice(0, currentMonthPosition),
    ]);
    if (pixelTopList.length > 12) ReorganizeMonths.push(ReorganizeMonths[0]);

    const serviceReading: ServiceReading[] = pixelTopList.map((bars, index) =>{
      const diferentYear = pixelTopList.length - Number.parseInt(Currentmonth);
      const month = ReorganizeMonths[index]
      const year = (index >= diferentYear ? CurrentYear : CurrentYear - 1).toString()
      const value= Math.round(pixelTopList[index] * reductionFactor) 
      return{
        serviceId: connection.serviceId,
        serviceConnectionId,
        userId: connection.userId,
        value: value,
        unit: getServiceTypeUnit(connection.type),
        readingDate: parseDate(`01/${month}/${year}`),
        month,
        year,
        type: connection.type,
      };
    })

    return serviceReading;
};

export interface pixelPosition{
     x: number; 
     y: number
}

