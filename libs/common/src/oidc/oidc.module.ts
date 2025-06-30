import { DynamicModule, Module } from "@nestjs/common";
import { KcService } from "./kc.service";
import { HttpModule } from "@nestjs/axios";
import { DBService } from "./db.service";
import { DatabaseModule } from "../database/database.module";
import { MemberEntity } from "../database/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "../mail/mail.module";

@Module({})
export class OidcModule {
  static forRoot(): DynamicModule {

    const getOidcProvider = () => {
      switch (process.env.OIDC_PROVIDER) {
        case "KEYCLOAK":
          return KcService;
        default:
          return KcService;
      }
    }

    const oidcProvider = {
      provide: 'OidcProviderService',
      useClass: getOidcProvider(),
    };

    return {
      module: OidcModule,
      imports: [
        HttpModule,
        DatabaseModule,
        TypeOrmModule.forFeature([MemberEntity]),
        MailModule
      ],
      providers: [oidcProvider, DBService],
      exports: [oidcProvider],
    };
  }

}

