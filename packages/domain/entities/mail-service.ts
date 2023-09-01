export interface MailService {
  sendTemplate(data: {
    emails: string[];
    bcc: string[];
    templateId: "d-7fa0e2725d424eff9e94a7097cb7a077";
    templateData: { [key: string]: string };
  }): Promise<void>;
}
