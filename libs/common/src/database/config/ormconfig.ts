import 'dotenv/config';
import { DataSource } from 'typeorm';
import { PlatformEntity, DocEntity, FileUploadEntity, UploadVersionEntity, OrgGroupEntity, ProjectEntity, ProjectGitSourceEntity, MemberProjectEntity, MemberEntity, DiscoveryMessageEntity, DeployStatusEntity, DeviceEntity, DeliveryStatusEntity, MapEntity, DeviceMapStateEntity, ProductEntity, BugReportEntity, OrgUIDEntity, DeviceComponentEntity, ComponentOfferingEntity, DeviceConfigEntity, MapOfferingEntity, RegulationEntity, RegulationTypeEntity, RegulationStatusEntity, ReleaseEntity, ReleaseArtifactEntity, ProjectTokenEntity, DeviceTypeEntity, LabelEntity, OfferingTreePolicyEntity, RuleFieldEntity, RuleEntity, RuleReleaseEntity, RuleDeviceTypeEntity, RuleDeviceEntity, RuleOsEntity, PendingVersionEntity, OSEntity} from '../entities';
import { join } from 'path';
import { readFileSync } from 'fs'
import { JobsEntity } from '../entities/map-updatesCronJob';
import { DeliveryEntity, DeliveryItemEntity, CacheConfigEntity } from '../../database-proxy/entities';
import { ReleaseSubscriber } from '../subscribers';

const region = process.env.REGION ? `_${process.env.REGION}` : '';
let migrationsRun: boolean = true
if (process.env.MIGRATION_RUN) {
  migrationsRun = process.env.MIGRATION_RUN === 'true'
}

const ormConfig = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: `${process.env.POSTGRES_DB}${region}`,
  username: process.env.POSTGRES_USER,
  connectTimeoutMS: 5000,


  ...getDBAuthParams(),

  subscribers: [ReleaseSubscriber],
  entities: [
    UploadVersionEntity,
    ProjectEntity,
    ProjectGitSourceEntity,
    MemberProjectEntity,
    MemberEntity,
    DiscoveryMessageEntity,
    DeliveryStatusEntity,
    DeployStatusEntity,
    DeviceEntity,
    OrgGroupEntity,
    OrgUIDEntity,
    MapEntity,
    ProductEntity,
    DeviceMapStateEntity,
    DeliveryEntity,
    DeliveryItemEntity,
    CacheConfigEntity,
    JobsEntity,
    BugReportEntity,
    DeviceConfigEntity,
    DeviceComponentEntity,
    ComponentOfferingEntity,
    MapOfferingEntity,
    RegulationEntity,
    RegulationTypeEntity,
    RegulationStatusEntity,
    FileUploadEntity,
    ReleaseEntity,
    ReleaseArtifactEntity,
    ProjectTokenEntity,
    DocEntity,
    LabelEntity,
    PlatformEntity,
    DeviceTypeEntity,
    OfferingTreePolicyEntity,
    RuleFieldEntity,
    RuleEntity,
    RuleReleaseEntity,
    RuleDeviceTypeEntity,
    RuleDeviceEntity,
    RuleOsEntity,
    PendingVersionEntity,
    OSEntity,
  ],
  migrations: [join(__dirname, '../migration/*.{js,ts}')],
  logging: false,
  synchronize: false,
  migrationsRun: migrationsRun,
  migrationsTableName: "migrations",
});

function getDBAuthParams() {
  switch (process.env.DEPLOY_ENV) {
    case "CTS":  //todo: remove in the future
    case "TNG":  //todo: remove in the future
    case "ORIGIN":
    case "PROXY":
      return {
        ssl: {
          ca: [readFileSync(process.env.DB_PEM_PATH ?? "")],
          key: [readFileSync(process.env.DB_KEY_PATH ?? "")],
          cert: [readFileSync(process.env.DB_CERT_PATH ?? "")]
        }
      }

    default:
      return {
        password: process.env.POSTGRES_PASSWORD,
      }

  }
}
export default ormConfig;