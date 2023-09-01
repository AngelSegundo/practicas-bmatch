import { FileData, StorageService } from "../services/storage-service";

export class MockStorageService implements StorageService {
  saveFile(props: {
    bucket: string;
    file: FileData;
    path: string;
    fileName: string;
  }): Promise<string> {
    return Promise.resolve("success");
  }
  getFile(props: { bucket: string; path: string }): Promise<File> {
    return Promise.resolve(new File([], ""));
  }
  getFileSignedUrl(props: { bucket: string; path: string }): Promise<string> {
    return Promise.resolve("http://sample:3000/success");
  }
}
