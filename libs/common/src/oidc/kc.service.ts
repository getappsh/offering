import { Injectable, Logger } from "@nestjs/common";
import { OidcService, UserSearchDto } from "./oidc.interface";
import { UserDto } from "../dto/oidc/dto/user.dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { MailService } from "../mail/mail.service";

@Injectable()
export class KcService implements OidcService {

  private readonly logger = new Logger(KcService.name);

  BASE_URL = process.env.AUTH_SERVER_URL;
  accessToken: string = '';
  expiredAccessToken: number = 0;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly mailer: MailService
  ) { }

  async authenticate(): Promise<void> {
    if (this.expiredAccessToken < Date.now() + 5000) {
      await this.login();
    }
  }

  async login() {
    this.logger.log('login as admin to keycloak');

    const relativeUrl = '/realms/getapp/protocol/openid-connect/token';

    const data = new URLSearchParams();
    // data.append('client_id', 'admin-cli');
    // data.append('username', this.config.get('KC_ADMIN_USER'));
    // data.append('password', this.config.get('KC_ADMIN_PASSWORD'));
    // data.append('grant_type', 'password');

    data.append('client_id', this.config.get('CLIENT_ID'));
    data.append('client_secret', this.config.get('SECRET_KEY'));
    data.append('grant_type', 'client_credentials');


    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const res = await this.httpService.axiosRef.post(this.BASE_URL + relativeUrl, data, { headers: headers })
    this.accessToken = res.data.access_token;
    this.expiredAccessToken = Date.now() + res.data.expires_in * 1000;

  }

  async getUsers(params?: UserSearchDto, limit?:number): Promise<UserDto[]> {
    this.logger.log('get all users');

    await this.authenticate();

    let query = '';
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        query += `&${key}=${value}`
      })
    }

    const relativeUrl = '/admin/realms/getapp/users';

    let headers = {
      'Authorization': 'Bearer ' + this.accessToken
    }

    const res = await this.httpService.axiosRef.get(this.BASE_URL + relativeUrl + "?" + query + `&max=${limit ?? 10}`, { headers: headers }).catch(err => {
      this.logger.error("Get user from kc failed", err);
      throw err;
    })

    const resUsers = res.data.map(UserDto.fromUserDto)
    return resUsers;
  }

  async inviteUser(params: UserDto): Promise<void> {

    let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Join GetApp</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              background: #fff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background-color: #007bff;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
            }
            .content p {
              margin: 0 0 16px;
            }
            .cta-button {
              display: block;
              text-align: center;
              margin: 20px 0;
            }
            .cta-button a {
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 4px;
              font-size: 16px;
              transition: background-color 0.3s;
            }
            .cta-button a:hover {
              background-color: #0056b3;
            }
            .footer {
              background-color: #f1f1f1;
              text-align: center;
              padding: 10px;
              font-size: 14px;
              color: #555;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to GetApp!</h1>
            </div>
            <div class="content">
              <p>We are excited to invite you to join <strong>GetApp</strong>, your ultimate solution for managing and exploring applications.</p>
              <p>Register now to enjoy the full benefits of our platform, including personalized recommendations, seamless navigation, and exclusive features tailored just for you!</p>
              <div class="cta-button">
                <a href="http://localhost:8080/realms/getapp/protocol/openid-connect/registrations?client_id=api&scope=openid%20profile&redirect_uri=http://localhost:3001/api/auth/callback/keycloak&response_type=code" target="_blank">Register Now</a>
              </div>
            </div>
            <div class="footer">
              <p>If you have any questions, feel free to <a href="https://docs.getapp.sh/" target="_blank">contact us</a>.</p>
            </div>
          </div>
        </body>
        </html>
        `
    try {
      this.logger.log("Sent an invitation email")
      this.logger.debug(`Sent an invitation email: ${params.email}`)
      await this.mailer.sendMail({ html, to: params.email, subject: "Invitation to GetApp" })
    } catch (error) {
      this.logger.error("Failed to send an invitation email", error)
    }
  }
}