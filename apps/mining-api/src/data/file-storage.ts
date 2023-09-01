import { FileData, StorageService } from "domain/services";
import { getStorage, Storage } from "firebase-admin/storage";

const storage: Storage = getStorage();

export class FileStorage implements StorageService {
  async saveFile(props: {
    bucket: string;
    file: FileData;
    path: string;
    fileName: string;
  }): Promise<string> {
    const { bucket, file, path, fileName } = props;
    const fileRef = storage.bucket(bucket).file(path + fileName);
    await fileRef.save(file.buffer);
    return fileRef.name;
  }

  async getFile(props: { bucket: string; path: string }): Promise<any> {
    const response = await storage.bucket(props.bucket).file(props.path).get();
    return response[0];
  }

  async downloadFile(props: { bucket: string; path: string }): Promise<any> {
    const response = await storage
      .bucket(props.bucket)
      .file(props.path)
      .download();
    return response[0];
  }

  async getFileSignedUrl(props: {
    bucket: string;
    path: string;
  }): Promise<string> {
    const ts = Date.now();
    const [fileUrl] = await storage
      .bucket(props.bucket)
      .file(props.path)
      .getSignedUrl({
        action: "read",
        expires: ts + 3600 * 1000,
      });
    return fileUrl;
  }
}
