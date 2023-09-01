import { getGraph } from "./getGraph";
import { RecordSizeProperties } from "./configGraphImg";
import { GraphicValidator, validateGraph } from "./validateGraph";
import { Screenshot } from "./screenshot";
import { FileStorage } from "../../data/file-storage";
import { ServiceConnectionDTO, ServiceReading } from "domain/entities";

let dirPathPdf:any;
interface FileDownload{
  bucket: string;
  filePath: string;
}

export const prossesGraph = async ( 
  consmptn: number, 
  month: string, 
  year:string, FileDownload: FileDownload, 
  connection: ServiceConnectionDTO,
  serviceConnectionId: string): 
  Promise<ServiceReading[]> => {
  
    const storage = new FileStorage();
    const {bucket,filePath} =FileDownload
    dirPathPdf = await storage.downloadFile({ bucket, path: filePath });

    RecordSizeProperties.destroyInstance()
 
    const consumption = Math.floor(consmptn);
    if (consumption == 0) {
      console.log("No se pude generar grafico con consumo 0 en mes actual");
      return []
    }
  

    const baseGraficoValido: GraphicValidator = await ScreenshotAndValidateGraph();

    if (baseGraficoValido.validatedGraph) {
      console.log("valido");
      const {validGraphBasePX, JimpRecord }=baseGraficoValido
      return await getGraph( consumption, month, Number.parseInt(year), validGraphBasePX, JimpRecord, connection, serviceConnectionId );
    } else {
      console.log("error no se encontro un grafico valido");
      return [];
    }
};
const ScreenshotAndValidateGraph = async ( inputXPX: number = 0, inputHeight: number = 0): Promise<GraphicValidator> => {
  let {x,height,width} = RecordSizeProperties.getInstance().sizeRecord
  // redimenciona la unicacion de la imagen para hacer un recorte mas preciso
  const {setSizeRecord} = RecordSizeProperties.getInstance()
  setSizeRecord("x", (x += inputXPX));

  setSizeRecord("width", (width -= inputXPX));

  setSizeRecord("height", (height -= inputHeight));

  // crea la imagen en base al PDF y recorta la imagen
  const imgRecord = await Screenshot(dirPathPdf);
  //crear funcion validar grafico
  console.log("validando grafico...");
 
  const graphicValidator = await validateGraph(imgRecord);

  if (graphicValidator.validatedGraph) {
    return Promise.resolve(graphicValidator);
  } else {
    if (graphicValidator.withoutSolution) {
      return Promise.resolve(graphicValidator);
    } else {
      return Promise.resolve( await ScreenshotAndValidateGraph( graphicValidator.x, graphicValidator.height) );
    }
  }
};
