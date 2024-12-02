import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailService } from "./mail.service";

@Module({
  imports: [MailerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      transport: {
        host: configService.get<string>('SMTP_HOST'),
        port: configService.get<number>('SMTP_PORT') || 25,
        secure: configService.get<boolean>('SMTP_SECURE') === true,
        auth: {
          user: configService.get<string>('SMTP_USER'),
          pass: configService.get<string>('SMTP_PASSWORD'),
        },
      },
      defaults: {
        from: `"No Reply" <${configService.get<string>('SMTP_FROM') || "noreply@example.com"}>`
      }
    }),
    inject: [ConfigService]
  })],

  providers: [MailService],
  exports: [MailService],
})
export class MailModule{}