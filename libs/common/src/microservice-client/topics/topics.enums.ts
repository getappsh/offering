import 'dotenv/config';
const region = process.env.REGION ? `.${process.env.REGION}` : '';

export const UploadTopics = {
    UPLOAD_ARTIFACT: `getapp-upload.artifact${region}`,
    UPLOAD_MANIFEST: `getapp-upload.manifest${region}`,
    UPDATE_UPLOAD_STATUS: `getapp-upload.update-upload-status${region}`,
    LAST_VERSION: `getapp-upload.last-version${region}`,
    CHECK_HEALTH: `getapp-upload.check-health${region}`,
    CREATE_FILE_UPLOAD_URL: `getapp-upload.create-file-upload-url${region}`,

// Releases
    GET_RELEASES: `getapp-upload.get-releases${region}`,
    GET_RELEASE_BY_VERSION: `getapp-upload.get-release-by-version${region}`,
    SET_RELEASE: `getapp-upload.set-release${region}`,
    DELETE_RELEASE: `getapp-upload.delete-release${region}`,

    SET_RELEASE_ARTIFACT: `getapp-upload.set-release-artifact${region}`,
    DELETE_RELEASE_ARTIFACT: `getapp-upload.delete-release-artifact${region}`,
    GET_ARTIFACT_DOWNLOAD_URL: 'getapp-upload.get-artifact-download-url',
    GET_ARTIFACT_UPLOAD_URL:    'getapp-upload.get-artifact-upload-url',
// Regulation Status
    GET_VERSION_REGULATIONS_STATUSES: `getapp-upload.get-version-regulation-statuses${region}`,
    GET_VERSION_REGULATION_STATUS_BY_ID: `getapp-upload.get-version-regulation-status-by-id${region}`,
    SET_VERSION_REGULATION_STATUS: `getapp-upload.set-version-regulation-status${region}`,
    SET_VERSION_REGULATION_COMPLIANCE: `getapp-upload.set-version-regulation-compliance${region}`,
    DELETE_VERSION_REGULATION_STATUS: `getapp-upload.delete-version-regulation-status${region}`,
    
} as const

export const UploadTopicsEmit = {
    PROJECT_REGULATION_CHANGED: `getapp-upload.project-regulation-changed${region}`,
}

export const DeliveryTopics = {
    PREPARE_DELIVERY: `getapp-delivery.prepare${region}`,
    PREPARED_DELIVERY_STATUS: `getapp-delivery.prepared-status${region}`,
    GET_CACHE_CONFIG: `getapp-delivery.get-cache-config${region}`,
    SET_CACHE_CONFIG: `getapp-delivery.set-cache-config${region}`,
    CHECK_HEALTH: `getapp-delivery.check-health${region}`
} as const

export const DeliveryTopicsEmit = {
    UPDATE_DOWNLOAD_STATUS: `getapp-delivery.update-download-status${region}`,
    DELETE_CACHE_ITEMS: `getapp-delivery.delete-cache-items${region}`,
}

export const OfferingTopics = {
    // Deprecated
    DEVICE_COMPONENT_OFFERING: `getapp-offering.device-components${region}`,
    DEVICE_MAP_OFFERING: `getapp-offering.device-map${region}`,
    GET_OFFER_OF_COMP: `getapp-offering.get-offering-of-comp${region}`,
    CHECK_HEALTH: `getapp-offering.check-health${region}`
} as const

export const OfferingTopicsEmit = {
    COMPONENT_UPLOAD_EVENT: `getapp-offering.component-upload-event${region}`,
    RELEASE_CHANGED_EVENT: `getapp-offering.release-changed-event${region}`,
    OFFERING_PUSH: `getapp-offering.push${region}`,
    DEVICE_SOFTWARE_EVENT: `getapp-offering.device.software-event${region}`,
    DEVICE_MAP_EVENT: `getapp-offering.device.map-event${region}`,
}
export const DeployTopics = {
    CHECK_HEALTH: `getapp-deploy.check-health${region}`
} as const

export const DeployTopicsEmit = {
    UPDATE_DEPLOY_STATUS: `getapp-deploy.update-deploy-status${region}`,
} as const

export const ProjectManagementTopics = {
    GET_USERS: `getapp-project-management.get-users${region}`,
    GET_USER_PROJECTS: `getapp-project-management.get-user-projects${region}`,

    CREATE_PROJECT: `getapp-project-management.create-project${region}`,
    EDIT_PROJECT: `getapp-project-management.edit-project${region}`,
    DELETE_PROJECT: `getapp-project-management.delete-project${region}`,
    GET_PROJECTS: `getapp-project-management.get-projects${region}`,
    SEARCH_PROJECTS: `getapp-project-management.search-projects${region}`,
    GET_PROJECT_BY_IDENTIFIER: `getapp-project-management.get-project-by-identifier${region}`,
    GET_PLATFORMS: `getapp-project-management.get-platforms${region}`,

    ADD_PROJECT_NEW_MEMBER: `getapp-project-management.add-project-new-member${region}`,
    CONFIRM_PROJECT_MEMBER: `getapp-project-management.confirm-project-member${region}`,
    EDIT_PROJECT_MEMBER: `getapp-project-management.edit-project-member${region}`,
    REMOVE_PROJECT_MEMBER: `getapp-project-management.remove-project-member${region}`,
    GET_MEMBER_PROJECT_PREFERENCES: `getapp-project-management.get-member-project-preferences${region}`,
    UPDATE_MEMBER_PROJECT_PREFERENCES: `getapp-project-management.update-member-project-preferences${region}`,

    GET_PROJECT_RELEASES: `getapp-project-management.get-project-releases${region}`,

    GET_DEVICES_BY_CATALOG_ID: `getapp-project-management.get-devices-by-catalog-id${region}`,
    GET_DEVICES_BY_PROJECT: `getapp-project-management.get-devices-by-project${region}`,
    GET_DEVICES_BY_PLATFORM: `getapp-project-management.get-devices-by-platform${region}`,

    GET_REGULATION_TYPES: `getapp-project-management.get-regulation-types${region}`,
    GET_PROJECT_REGULATIONS: `getapp-project-management.get-project-regulations${region}`,
    GET_PROJECT_REGULATION_BY_NAME: `getapp-project-management.get-project-regulation-by-name${region}`,
    CREATE_PROJECT_REGULATION: `getapp-project-management.create-project-regulation${region}`,
    UPDATE_PROJECT_REGULATION: `getapp-project-management.update-project-regulation${region}`,
    UPDATE_PROJECT_REGULATIONS: `getapp-project-management.update-project-regulations${region}`,
    DELETE_PROJECT_REGULATION: `getapp-project-management.delete-project-regulation${region}`,

    // Tokens
    GET_PROJECT_TOKENS: `getapp-project-management.get-project-tokens${region}`,
    GET_PROJECT_TOKEN_BY_ID: `getapp-project-management.get-project-token-by-id${region}`,
    CREATE_PROJECT_TOKEN: `getapp-project-management.create-project-token${region}`,
    UPDATE_PROJECT_TOKEN: `getapp-project-management.update-project-token${region}`,
    DELETE_PROJECT_TOKEN: `getapp-project-management.delete-project-token${region}`,

    // Docs
    GET_PROJECT_DOCS: `getapp-project-management.get-project-docs${region}`,
    GET_PROJECT_DOC_BY_ID: `getapp-project-management.get-project-doc-by-id${region}`,
    CREATE_PROJECT_DOC: `getapp-project-management.create-project-doc${region}`,
    UPDATE_PROJECT_DOC: `getapp-project-management.update-project-doc${region}`,
    DELETE_PROJECT_DOC: `getapp-project-management.delete-project-doc${region}`,

    CHECK_HEALTH: `getapp-project-management.check-health${region}`
} as const

export const ProjectManagementTopicsEmit = {
    PROJECT_RELEASES_CHANGED: `getapp-project-management.project-releases-changed${region}`,
}

export const GetMapTopics = {
    // Discovery
    GET_RECORDS_COUNT: `getapp-map.discovery.get-records-count-of-device${region}`,
    // Import
    GET_IMPORT_STATUS: `getapp-map.get.import.status${region}`,
    POST_IMPORT_STATUS: `getapp-map.post.import.status${region}`,
    CREATE_IMPORT: `getapp-map.import.create${region}`,
    CANCEL_IMPORT_CREATE: `getapp-map.import.create.cancel${region}`,
    EXPORT_NOTIFICATION: `getapp-map.export.notify${region}`,
    // Inventory
    GET_INVENTORY_UPDATES: `getapp-map.inventory.updates${region}`,
    // admin
    MAP_PUT: `getapp-map.put${region}`,
    // Device
    REGISTER_MAP: `getapp-device.map.register${region}`,
    DISCOVERY_MAP: `getapp-device.discover.map${region}`,

    MPA_PROPERTIES: `getapp-map.map.properties${region}`,

    CHECK_HEALTH: `getapp-map.check-health${region}`
} as const

export const GetMapTopicsEmit = {
    MAP_UPDATES_JOB_START: `getapp-device.map.job.updates.start${region}`,
} as const

export const DeviceTopics = {
    All_DEVICES: `getapp-device.all${region}`,
    DEVICE_SOFTWARES: `getapp-device.device.softwares${region}`,
    DEVICES_SOFTWARE_STATISTIC_INFO: `getapp-device.device.software.statistic.info${region}`,
    DEVICES_MAP_STATISTIC_INFO: `getapp-device.device.map.statistic.info${region}`,
    DEVICES_PUT: `getapp-device.put${region}`,
    DEVICE_MAPS: `getapp-device.device.maps${region}`,
    All_MAPS: `getapp-map.maps${region}`,
    GET_MAP: `getapp-map.map.id${region}`,
    REGISTER_SOFTWARE: `getapp-device.register.software${region}`,
    DEVICE_CONTENT: `getapp-device.content.installed${region}`,
    IM_PULL_DISCOVERY: `getapp-device.im.pull.discovery${region}`,
     // Config
     GET_DEVICE_CONFIG: `getapp-device.config.get${region}`,
     SET_DEVICE_CONFIG: `getapp-device.config.set${region}`,
    CHECK_HEALTH: `getapp-device.check-health${region}`
} as const

export const DeviceTopicsEmit = {
    DISCOVER_DEVICE_CONTEXT: `getapp-device.discover.device-context${region}`,
    DISCOVER_DEVICE_CONTEXT_V2: `getapp-device.discover.device-context-V2${region}`,
    UPDATE_DEVICE_SOFTWARE_STATE: `getapp-device.device.update-software-state${region}`,
    UPDATE_DEVICE_MAP_STATE: `getapp-device.device.update-map-state${region}`,
    REGISTER_MAP_TO_DEVICE: `getapp-device.map.register-to-device${region}`,
    REGISTER_MAP_INVENTORY: `getapp-device.map.register-inventory${region}`,
    MAP_UPDATES_JOB_START: `getapp-device.map.job.updates.start${region}`,
    UPDATE_TLS_STATUS: `getapp-device.update.tls.status${region}`,
    IM_PUSH_DISCOVERY: `getapp-device.im.push.discovery${region}`,
    RELEASE_CHANGED_EVENT: `getapp-device.release-changed-event${region}`,
} as const


export const DevicesGroupTopics = {
    CREATE_GROUP: `getapp-device.group.create${region}`,
    EDIT_GROUP: `getapp-device.group.edit${region}`,
    GET_GROUPS: `getapp-device.group.get-all${region}`,
    GET_GROUP_DEVICES: `getapp-device.group.get-devices${region}`,
    SET_GROUP_DEVICES: `getapp-device.group.set-devices${region}`,
} as const

export const DeviceBugReportTopics = {
    NEW_BUG_REPORT: `getapp-device.bug-report.new${region}`,
    GET_BUG_REPORT: `getapp-device.bug-report.get${region}`,
} as const