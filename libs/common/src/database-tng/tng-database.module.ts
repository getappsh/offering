import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormConfig from "./config/ormconfig";

@Module({
    imports: [TypeOrmModule.forRootAsync({useFactory: () => ormConfig.options})],
})
export class TngDatabaseModule {}