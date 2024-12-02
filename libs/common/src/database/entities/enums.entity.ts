export enum OS {
    ANDROID = 'android',
    WINDOWS = 'windows',
    LINUX = 'linux',
}

export enum Components {
    ANDROID = 'android',
    WINDOWS = 'windows',
    LINUX = 'linux',
}

export enum Formation {
    YAAT = 'yaat',
    YATUSH = 'yatush',
    HQTACTIC = 'hqtactic'
}

export enum PackageStatus {
    IN_PROGRESS = "inProgress",
    READY = "ready"
}

export enum RoleInProject {
    PROJECT_OWNER = 'project-owner',
    PROJECT_ADMIN = 'project-admin',
    PROJECT_MEMBER = 'project-member'
}

export enum DiscoveryType {
    GET_APP = 'get-app',
    GET_MAP = 'get-map',
    MTLS = 'mTls'
}

export enum UploadStatus {
    STARTED = 'started',
    DOWNLOADING_FROM_URL = 'downloading-from-url',
    FAIL_TO_DOWNLOAD = 'fail-to-download',
    UPLOADING_TO_S3 = 'uploading-to-s3',
    FAIL_TO_UPLOAD = 'fail-to-upload',
    IN_PROGRESS = 'in-progress',
    READY = 'ready',
    ERROR = 'error'
}

export enum DeliveryStatusEnum {
    START = 'Start',
    DONE = 'Done',
    ERROR = 'Error',
    CANCELLED = "Cancelled",
    PAUSE = "Pause",
    CONTINUE = "Continue",
    DOWNLOAD = "Download",
    DELETED = 'Deleted'

}

export enum PrepareStatusEnum {
    START = "start",
    IN_PROGRESS = "inProgress",
    DONE = "done",
    ERROR = "error",
    DELETE = "delete",
}

export enum DeployStatusEnum {
    START = 'Start',
    DONE = 'Done',
    INSTALLING = "Installing",
    CONTINUE = "Continue",
    PAUSE = "Pause",
    CANCELLED = "Cancelled",
    ERROR = 'Error',
    UNINSTALL = 'Uninstall'
}

export enum ItemTypeEnum {
    SOFTWARE = 'software',
    MAP = 'map',
    CACHE = 'cache'
}

export enum MapImportStatusEnum {
    START = 'Start',
    IN_PROGRESS = 'InProgress',
    DONE = 'Done',
    CANCEL = 'Cancel',
    PAUSED = 'Pause',
    ERROR = 'Error',
    PENDING = 'Pending',
    EXPIRED = 'Expired',
    ARCHIVED = 'Archived',
}

export enum LibotExportStatusEnum {
    PENDING = 'PENDING',
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ABORTED = "ABORTED",
    PAUSED = "PAUSED",
    FAILED = "FAILED",
    EXPIRED = "EXPIRED",
    ARCHIVED = "ARCHIVED",
}

export enum DeviceMapStateEnum {
    OFFERING = "offering",
    PUSH = "push",
    IMPORT = "import",
    DELIVERY = "delivery",
    DELETED = "deleted",
    INSTALLED = "installed",
    UNINSTALLED = "uninstalled"
}

export enum DeviceComponentStateEnum{
    OFFERING = "offering",
    PUSH = "push",
    DELIVERY = "delivery",
    DELETED = "deleted",
    DEPLOY = "deploy",
    INSTALLED = "installed",
    UNINSTALLED = "uninstalled",
}

export enum OfferingActionEnum{
    OFFERING = "offering",
    PUSH = "push"
}

export enum HashAlgorithmEnum {
    SHA256Hex = "SHA256Hex",
    SHA256Base64 = "SHA256Base64",
}

