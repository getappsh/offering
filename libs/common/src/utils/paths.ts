// global paths
export const API = "api/";

// base paths
export const LOGIN = "login";
export const UPLOAD = "upload";
export const DELIVERY = "delivery";
export const DEPLOY = "deploy";
export const OFFERING = "offering";
export const DISCOVERY = "discovery";
export const PROJECT_MANAGEMENT = "project";
export const USERS = "users";
export const DEVICE = "device";
export const DEVICE_GROUP = "group";
export const UPLOAD_RELEASES = 'releases';

export const GET_MAP = "map";
export const BUG_REPORT = "bug-report"


// nested login paths
export const REFRESH = "/refresh"

// nested delivery paths
export const PREPARE_DELIVERY = "/prepareDelivery"
export const PREPARED_DELIVERY = "/preparedDelivery"
export const UPDATE_DOWNLOAD_STATUS = "/updateDownloadStatus"

// nested delivery paths
export const UPDATE_DEPLOY_STATUS = "/updateDeployStatus"

// nested offering paths
export const COMPONENT = "/component"

// nested project management paths
export const PROJECT = "/project"
export const CONFIG_OPTION = "/projectConfigOption"
export const CREATE_TOKEN = "/createToken"
export const RELEASES = "/projectReleases"
export const DEVICES_CATALOG_ID = "/devices/catalogId/"
export const DEVICES_PROJECT_ID = "/devices/project/"
export const DEVICES_PLATFORM = "/devices/platform/"

// nested upload paths
export const MANIFEST = "/manifest"
export const UPDATE_UPLOAD_STATUS = "/updateUploadStatus"

// nested device paths
export const DISCOVER = "/discover"
export const INSTALLED = "/info/installed/"
export const TLS_STATUS = "/mTlsStatus"

// nested map paths
export const CREATE = "/import/create"
export const STATUS = "/import/status/"


export const ApiEndpoints = {
  checkHealth: 'checkHealth',
}
export const DeliveryEndpoints = {
  updateDownloadStatus: 'delivery/updateDownloadStatus',
  preparedDelivery: 'delivery/prepareDelivery',
  getPreparedByCatalogId: 'delivery/preparedDelivery/',
  cacheConfig: 'delivery/cache/config',
  cacheDelete: 'delivery/cache/delete',
  checkHealth: 'delivery/checkHealth',
}