import { FileData, StorageService } from "domain/services";
import { getStorage, Storage } from "firebase-admin/storage";

const storage: Storage = getStorage();

export class FileStorage implements StorageService {
  async saveFile(props: {
    file: FileData;
    path: string;
    fileName: string;
  }): Promise<string> {
    const { file, path, fileName } = props;
    const fileRef = storage.bucket().file(path + fileName);
    await fileRef.save(file.buffer);
    return fileRef.name;
  }

  async downloadFile(props: { path: string }): Promise<any> {
    const response = await storage
      .bucket()
      .file(props.path)
      .download();
    return response[0];
  }

  async getFile(props: { path: string }): Promise<any> {
    const response = await storage.bucket().file(props.path).get();
    return response[0];
  }

  async getFileSignedUrl(props: {
    bucket: string;
    path: string;
  }): Promise<string> {
    const ts = Date.now();
    const [fileUrl] = await storage
      .bucket()
      .file(props.path)
      .getSignedUrl({
        action: "read",
        expires: ts + 3600 * 1000,
      });
    return fileUrl;
  }
}
