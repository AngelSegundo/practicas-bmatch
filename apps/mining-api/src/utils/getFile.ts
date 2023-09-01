import { FileStorage } from "../data/file-storage";

const storage = new FileStorage();

const getFile = async ({
  bucket,
  filePath,
}: {
  bucket: string;
  filePath: string;
}): Promise<Buffer> => {
  const file = await storage.downloadFile({ bucket, path: filePath });
  return file;
};

export default getFile;
