import { getListPIxels, pixelPosition } from "./getGraph";
import { RecordSizeProperties } from "./configGraphImg";
import * as Jimp from "jimp";
//const {sizeRecord} = getRecordSizePorperties
export const validateGraph = async (
  JimpRecord: Jimp
): Promise<GraphicValidator> => {
  const { grayPixels, onlyOnePixelAxisY } = await getListPIxels(JimpRecord);
  const numberSpaceBtwnBar = 14;
  
  const returnObject = {
    validatedGraph: false,
    withoutSolution: false,
      height:
          RecordSizeProperties.getInstance().sizeRecord.height -
          grayPixels[grayPixels.length - 1].y,
        validGraphBasePX: [],
        JimpRecord,
  }
  
  if(onlyOnePixelAxisY.length == 0){ 
    if(grayPixels.length === 0){
      returnObject.withoutSolution = grayPixels.length === 0  
    }
    return returnObject;
  } 
  
  // valida que el primer pixel gris encontrado sea igual a 0 en ese caso debe devolver que hay un problema con el grafico y ajustar recorte hacia la derecha
  if (onlyOnePixelAxisY[0].x == 0 || onlyOnePixelAxisY[0].x == 1) {
    //la primera barra se encuentra en el pixel 0 o 1 esto seguramente esta topando con la barra inicial que marca los consumos
    return {
      validatedGraph: false,
      withoutSolution: false,
      x: 1,
      validGraphBasePX: [],
      JimpRecord,
    };
  }
  // valida que el ultimo pixel este a la distancia correcta de el final del recorte
  //esto lo repito mas abjao
  const lastPxGris = onlyOnePixelAxisY[onlyOnePixelAxisY.length - 1].x;
  const endPxImg = RecordSizeProperties.getInstance().sizeRecord.width;
  const difrenciaUltimoPXwithEndImg = endPxImg - lastPxGris;

  const { setSpaceBetweenBars } = RecordSizeProperties.getInstance();
  const spaceWhitePxlToleransMax = Math.round(
    setSpaceBetweenBars + setSpaceBetweenBars * 0.1
  );
  const spaceWhitePxlToleransMin = Math.round(
    setSpaceBetweenBars - setSpaceBetweenBars * 0.1
  );

  if (
    difrenciaUltimoPXwithEndImg > spaceWhitePxlToleransMin &&
    difrenciaUltimoPXwithEndImg > spaceWhitePxlToleransMax
  ) {
    //grafico invalido ya que contemplo un prorrateo
    console.log(
      "no valido fin de imagen supera ancho aceptado fin imagen:",
      difrenciaUltimoPXwithEndImg
    );
    return {
      validatedGraph: false,
      withoutSolution: false,
      validGraphBasePX: [],
      height: 1,
      JimpRecord,
    };
  }

  const whiteSpaceBetweenBars = getWhiteSpaceBetweenBars(onlyOnePixelAxisY);

  //console.log("espacios entre barras", whiteSpaceBetweenBars);
  //differences_SPC_BTW_Bar
  const firstSpacebar = whiteSpaceBetweenBars[0];
  const differences_const_SPC_BTW_Bar = firstSpacebar - setSpaceBetweenBars;
  if (
    differences_const_SPC_BTW_Bar != 0 &&
    differences_const_SPC_BTW_Bar != 1 &&
    differences_const_SPC_BTW_Bar < setSpaceBetweenBars
  ) {
    console.log(
      "demaciada diferencia en el primere espacio con el espacio constante:",
      differences_const_SPC_BTW_Bar
    );

    return {
      validatedGraph: false,
      withoutSolution: false,
      x: differences_const_SPC_BTW_Bar,
      validGraphBasePX: [],
      JimpRecord,
    };
  }

  const validSpaces = whiteSpaceBetweenBars.filter(
    (num) => num >= spaceWhitePxlToleransMin && num <= spaceWhitePxlToleransMax
  );
  const sumValidSpaces = validSpaces.reduce((a, b) => a + b);

  const averageWhitSepace = Math.round(sumValidSpaces / validSpaces.length);

  let ValidGraphBasePX = getValidGraphBasePX(onlyOnePixelAxisY);
  /**validar alto de la barra */

  const validateHigh = validateHighBase(ValidGraphBasePX, grayPixels);

  if (!validateHigh) {
    console.log("problema con la base");

    return {
      validatedGraph: false,
      withoutSolution: false,
      height: 1,
      validGraphBasePX: [],
      JimpRecord,
    };
  }

  let pixelsABar: pixelPosition[] = [];

  let barThickness = 0;
  for (const valor of ValidGraphBasePX) {
    barThickness += valor.length;
  }
  if (
    whiteSpaceBetweenBars.length < numberSpaceBtwnBar &&
    whiteSpaceBetweenBars.length != 0
  ) {
    console.log("le faltan meses al grafico");
    //console.log("barras blancas cantidad",whiteSpaceBetweenBars.length);
    //console.log("Promedio barras blancas",averageWhitSepace);

    const averageBars = Math.trunc(barThickness / ValidGraphBasePX.length);

    ValidGraphBasePX = [];
    
    onlyOnePixelAxisY.forEach((pixel, i) => {
      const nextPixel = onlyOnePixelAxisY[i + 1]?.x ?? pixel.x;
      const distanceBetweenPixel = nextPixel - pixel.x;
      
      if(
        distanceBetweenPixel != 0 &&
        distanceBetweenPixel != 1 &&
        distanceBetweenPixel >= spaceWhitePxlToleransMax
      ) {
        pixelsABar.push(pixel);
        ValidGraphBasePX.push(pixelsABar);
        pixelsABar.length = 0;
        
        const barrasfaltantes = Math.trunc(
          distanceBetweenPixel / (averageWhitSepace + averageBars)
        );
        let ultimaPixelBarra = pixel.x;
        for (let id = 0; id < barrasfaltantes; id++) {
          const xValue = ultimaPixelBarra + averageWhitSepace;

          for (let index = 0; index < averageBars; index++) {
            const x = Math.trunc(xValue + index);
            pixelsABar.push({ x, y: pixel.y });
          }
          ValidGraphBasePX.push(pixelsABar);
          pixelsABar = [];
          ultimaPixelBarra = ultimaPixelBarra + averageWhitSepace + averageBars;
        }
      }else if(
        distanceBetweenPixel >= spaceWhitePxlToleransMin &&
        distanceBetweenPixel <= spaceWhitePxlToleransMax
      ){
        pixelsABar.push(pixel);
        ValidGraphBasePX.push(pixelsABar);
        pixelsABar.length = 0;
      } else {
        pixelsABar.push(pixel);
      }
    })
    ValidGraphBasePX.push(pixelsABar);
  } else if (!validateHigh) {
    console.log("problema con la base");

    return {
      validatedGraph: false,
      withoutSolution: false,
      height: 1,
      validGraphBasePX: [],
      JimpRecord,
    };
  }
  // cuando tiene prorrateo
  else if (whiteSpaceBetweenBars.length > numberSpaceBtwnBar) {
    console.log("el grafico trae prorrateo");
    //console.log("promedio barra blanca",averageWhitSepace);
    let spaceWhitePxl = Math.round(averageWhitSepace);

    const spaceWhitePxlToleransMax = spaceWhitePxl + 2;
    const spaceWhitePxlToleransMin = spaceWhitePxl - 2;
    //console.log("rango", spaceWhitePxlToleransMax,spaceWhitePxlToleransMin);
    let joinSpecies: number = 0;
    ValidGraphBasePX = [];
    pixelsABar = [];
    for (let i = 0; i < onlyOnePixelAxisY.length; i++) {
      const nextPixel =
        onlyOnePixelAxisY[i + 1] == undefined
          ? onlyOnePixelAxisY[i].x
          : onlyOnePixelAxisY[i + 1].x;
      const distanceBtweenPixel = nextPixel - onlyOnePixelAxisY[i].x;
      if (
        distanceBtweenPixel != 0 &&
        distanceBtweenPixel != 1 &&
        distanceBtweenPixel <= spaceWhitePxlToleransMin
      ) {
        joinSpecies = joinSpecies + distanceBtweenPixel;
      }

      if (
        (distanceBtweenPixel >= spaceWhitePxlToleransMin &&
          distanceBtweenPixel <= spaceWhitePxlToleransMax) ||
        joinSpecies >=
          spaceWhitePxlToleransMin /* && joinSpecies <= spaceWhitePxlToleransMax */
      ) {
        if (
          !(
            joinSpecies >= spaceWhitePxlToleransMin &&
            joinSpecies <= spaceWhitePxlToleransMax
          )
        )
          pixelsABar.push(onlyOnePixelAxisY[i]);
        ValidGraphBasePX.push(pixelsABar);
        joinSpecies = 0;
        pixelsABar = [];
      } else if (i == onlyOnePixelAxisY.length - 1) {
        //no debe ingresar el ultimo valor si es que tiene prorrateo
      } else {
        pixelsABar.push(onlyOnePixelAxisY[i]);
      }
    }
    ValidGraphBasePX.push(pixelsABar);
    pixelsABar = [];
    /* console.log("arreglo final", ValidGraphBasePX);
      console.log("arreglo final lengh", ValidGraphBasePX.length) */
  }

  if (ValidGraphBasePX.length == 13) {
    //console.log("pixeles base de barras", ValidGraphBasePX);
    //console.log("pixeles base de barras lengh", ValidGraphBasePX.length);
    return {
      validatedGraph: true,
      withoutSolution: true,
      validGraphBasePX: ValidGraphBasePX,
      JimpRecord,
    };
  } else {
    //console.log("grafico no valido");
    return {
      validatedGraph: false,
      withoutSolution: true,
      validGraphBasePX: [],
      JimpRecord,
    };
  }
};

const getWhiteSpaceBetweenBars = (onlyOnePixelAxisY: pixelPosition[]) => {
  const whiteSpaceBetweenBars: number[] = []; // pixeles blanco
  const firstBarX = onlyOnePixelAxisY[0].x;
  const lastBarX = onlyOnePixelAxisY[onlyOnePixelAxisY.length - 1].x;
  const imageWidth = RecordSizeProperties.getInstance().sizeRecord.width;
  const lastWhiteSpace = imageWidth - lastBarX;
  whiteSpaceBetweenBars.push(firstBarX);
  //const {sizeRecord} = getRecordSizePorperties
  /** **************************************barras blancas************************************** */
  for (let index = 0; index < onlyOnePixelAxisY.length; index++) {
    const currentPixel = onlyOnePixelAxisY[index];
    const nextPixel = onlyOnePixelAxisY[index + 1]?.x;
    const distance = nextPixel - currentPixel.x;
    const distanceOperation = distance !== 0 && distance !== 1;
    if (distance && distanceOperation) {
      whiteSpaceBetweenBars.push(distance);
    }
  }
  whiteSpaceBetweenBars.push(lastWhiteSpace);
  return whiteSpaceBetweenBars;
};
const getValidGraphBasePX = (onlyOnePixelAxisY: pixelPosition[]) => {
  const ValidGraphBasePX: pixelPosition[][] = []; //firstbarThickness
  let pixelsABar: pixelPosition[] = [];
  for (let i = 0; i < onlyOnePixelAxisY.length; i++) {
    const nextPixel =
      onlyOnePixelAxisY[i + 1] == undefined
        ? onlyOnePixelAxisY[i].x
        : onlyOnePixelAxisY[i + 1].x;
    const distanceBtweenPixel = nextPixel - onlyOnePixelAxisY[i].x;
    if (distanceBtweenPixel != 0 && distanceBtweenPixel != 1) {
      pixelsABar.push(onlyOnePixelAxisY[i]);
      ValidGraphBasePX.push(pixelsABar);
      pixelsABar = [];
    } else {
      pixelsABar.push(onlyOnePixelAxisY[i]);
    }
  }
  ValidGraphBasePX.push(pixelsABar);
  pixelsABar = [];
  return ValidGraphBasePX;
};
export interface GraphicValidator {
  validatedGraph: boolean;
  withoutSolution: boolean;
  x?: number;
  height?: number;
  validGraphBasePX: pixelPosition[][];
  JimpRecord: Jimp;
}
const validateHighBase = (
  ValidGraphBasePX: pixelPosition[][],
  grayPixels: pixelPosition[],
  index: number = 0
): boolean => {
  let list: pixelPosition[][] = [];
  ValidGraphBasePX.map((baseBar) => {
    for (let pixelPosition of baseBar) {
      pixelPosition.y -= 1;
      list.push(
        grayPixels.filter(
          (px) => px.x == pixelPosition.x && px.y == pixelPosition.y
        )
      );
    }
  });
  if (list[0].length == 0) {
    return false;
  }
  return true;
};
