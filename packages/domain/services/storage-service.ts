export interface FileData {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  size: number;
}

export interface StorageService {
  saveFile(props: {
    bucket: string;
    file: FileData;
    path: string;
    fileName: string;
  }): Promise<string>;
  getFile(props: { bucket: string; path: string }): Promise<any>;
  getFileSignedUrl(props: { bucket: string; path: string }): Promise<string>;
  downloadFile(props: { bucket: string; path: string }): Promise<any>;
}
