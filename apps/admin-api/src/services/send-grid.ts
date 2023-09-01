import axios, { AxiosInstance } from "axios";
import { MailService } from "domain/entities";

export class SendGridService implements MailService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.sendgrid.com/v3",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY as string}`,
      },
    });
  }
  async sendTemplate(data: {
    emails: string[];
    bcc: string[];
    templateId: string;
    templateData: { [key: string]: string };
  }): Promise<void> {
    const { emails, bcc, templateId, templateData } = data;
    const response = await this.client.post("/mail/send", {
      from: {
        name: "Nicolle de Bmatch",
        email: "nicolle@bmatch.cl",
      },
      personalizations: [
        {
          to: emails.map((email) => ({
            email,
          })),
          ...(bcc.length > 0 && {
            bcc: bcc.map((email) => ({
              email,
            })),
          }),
          dynamic_template_data: templateData,
        },
      ],
      template_id: templateId,
    });
    return Promise.resolve();
  }
}
