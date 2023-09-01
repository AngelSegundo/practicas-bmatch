import https from "https";
import axios, { AxiosInstance } from "axios";

const CHAT_URL = "https://chat.googleapis.com/v1/spaces/AAAA1DJUwko/messages";

export class GoogleChatMessageService {
  private client: AxiosInstance;
  private key: string;
  private token: string;

  constructor({ key, token }: { key: string; token: string }) {
    this.key = key;
    this.token = token;
    this.client = axios.create({
      httpsAgent: new https.Agent({ keepAlive: true }),
      baseURL: CHAT_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async send({ message }: { message: string }): Promise<void> {
    try {
      await this.client.post(`?key=${this.key}&token=${this.token}`, {
        text: message,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createNewServiceConnectionMessage({
    userId,
    serviceName,
    serviceConnectionId,
  }: {
    userId: string;
    serviceName: string;
    serviceConnectionId: string;
  }): Promise<void> {
    await this.send({
      message: `Creada nueva conexión de servicio para el usuario ${userId} con el servicio ${serviceName} y el id de conexión ${serviceConnectionId}`,
    });
  }

  async updateServiceConnectionMessage({
    userId,
    serviceName,
    serviceConnectionId,
    config,
    source,
    result,
  }: {
    userId: string;
    serviceName: string;
    serviceConnectionId: string;
    config: { [key: string]: string | number };
    source: "app" | "backoffice" | "batch";
    result: "success" | "error";
  }): Promise<void> {
    await this.send({
      message: `
        El usuario ${userId} ha actualizado (${source.toUpperCase()}) el servicio ${serviceName} y con id ${serviceConnectionId} resultado: ${result.toUpperCase()} \n
        Configuración: ${JSON.stringify(config)}
      `,
    });
  }
}
