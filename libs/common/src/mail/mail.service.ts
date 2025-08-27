import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class MailService{

  private readonly logger = new Logger(MailService.name)

  constructor(
    private configService: ConfigService,
    private mailerService: MailerService
  ){}

  async sendMail(options: ISendMailOptions){
    this.logger.debug("Sending Mail")
    return this.mailerService.sendMail(options)

  }

  async sendBugReport(deviceId: string, agentVersion: string, description: string, logUrl: string){
    this.logger.log("Send BugReport mail");
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bug Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
          width: 80%;
          margin: 0 auto;
        }
        .header {
          background-color: #f44336;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .footer {
          padding: 10px;
          text-align: center;
          color: #777;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>System Test Error</h1>
        </div>
        <div class="content">
          <p><strong>Device ID:</strong></p>
          <p>${deviceId}</p>
          <p><strong>Agent Version:</strong></p>
          <p>${agentVersion}</p>
          <p><strong>Description of the bug:</strong></p>
          <p>${description}</p>
          <p><strong>URL for logs:</strong></p>
          <p><a href="${logUrl}">${logUrl}</a></p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;


    const subscribers = this.configService.get<string>('SMTP_BUG_REPORT_SUBSCRIBERS')?.split(',')
    this.logger.verbose(`subscribers: ${subscribers}`)
    try {
      let res = await this.mailerService.sendMail({
        to: subscribers,
        subject: 'Bug Report',
        html: html
      });
      this.logger.verbose(`Sending mail response: ${JSON.stringify(res)}`)

    }catch (e){
      this.logger.error(`Failed to send mail, error: ${e.message}`)
    }
  }

}