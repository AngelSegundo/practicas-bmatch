import { RecordSizeProperties } from "./configGraphImg";
import * as Jimp from "jimp";
import pdfImgConvert from "pdf-img-convert";
import fs = require("fs");
export const Screenshot = async (dirPathPdf: string) => {
  const {ResolutionPdfAsimg, sizeRecord, nameImgSaveRecord} =RecordSizeProperties.getInstance()
    const page = 1;
    const res: Uint8Array[] | string[]= await pdfImgConvert
    .convert(dirPathPdf, {
      page_numbers: [page],
      base64: false,
      width: ResolutionPdfAsimg,
    })

    const buffer = Buffer.from(res[0])
    const jimpRead = await Jimp.read(buffer);
    const { x, y, width , height} = sizeRecord;
          console.log("recorte", "x: ", x);
          console.log("recorte", "y: ", y);
          console.log("recorte", "width: ", width);
          console.log("recorte", "height: ", height);
    const croppedImage:Jimp = jimpRead.crop(x, y, width, height);
    
    await croppedImage.write(nameImgSaveRecord)

    //await new Promise((resolve) => setTimeout(resolve, 3000));
    return croppedImage
};