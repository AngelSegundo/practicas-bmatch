// @ts-ignore
import pdf from "pdf-extraction";
import { FileStorage } from "../data/file-storage";

const storage = new FileStorage();

interface PDFPage {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
}

const rearangeText = async ({
  pdfPageData,
  tolerance,
}: {
  pdfPageData: any;
  tolerance: number;
}) => {
  const render_options = {
    normalizeWhitespace: false,
    disableCombineTextItems: true,
  };

  const textContent = await pdfPageData.getTextContent(render_options);

  const items: PDFPage[] = textContent.items;

  // this orders items in y direction
  const orderedItems = items.sort((a, b) => {
    const aY = a.transform[5];
    const bY = b.transform[5];

    if (aY < bY) {
      return 1;
    }
    if (aY > bY) {
      return -1;
    }
    return 0;
  });

  let currentY = orderedItems[0].transform[5];

  const orderedRows = orderedItems.reduce((acc, item) => {
    const y = item.transform[5];
    if (currentY - y < tolerance) {
      acc[acc.length - 1].push(item);
    } else {
      acc.push([item]);
      currentY = y;
    }
    return acc;
  }, [[]] as PDFPage[][]);

  const orderedText = orderedRows.reduce((acc, item) => {
    const orderedRow = item
      .sort((a, b) => {
        const aX = a.transform[4];
        const bX = b.transform[4];

        if (aX < bX) {
          return -1;
        }
        if (aX > bX) {
          return 1;
        }
        return 0;
      })
      .map((i) => i.str)
      .join(" ");

    return acc + orderedRow + "\n";
  }, "");

  return orderedText.trim();
};

const getPDFText = async ({
  bucket,
  filePath,
  tolerance = 2,
}: {
  bucket: string;
  filePath: string;
  tolerance?: number;
}): Promise<string> => {
  const file = await storage.downloadFile({ bucket, path: filePath });
  const pdfFile = await pdf(file, {
    pagerender: (data: any) => {
      return rearangeText({ pdfPageData: data, tolerance });
    },
  });
  return pdfFile.text;
};

export default getPDFText;
