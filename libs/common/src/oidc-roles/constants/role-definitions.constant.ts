import { ApiRole } from '../../permissions/constants/roles.enum';

/**
 * Role descriptions for better documentation in OIDC provider
 * Note: Descriptions are optional. If a role is added to ApiRole enum without a description,
 * it will still be created in OIDC with a default description based on the role name.
 */
export const ROLE_DESCRIPTIONS: Partial<Record<ApiRole, string>> = {
  [ApiRole.PERMISSIONS_ENABLED]: 'Special stamp role that enables permission validation when present',

  // Project Management
  [ApiRole.CREATE_PROJECT]: 'Permission to create new projects',
  [ApiRole.VIEW_PROJECT]: 'Permission to view project details',
  [ApiRole.UPDATE_PROJECT]: 'Permission to update existing projects',
  [ApiRole.DELETE_PROJECT]: 'Permission to delete projects',
  [ApiRole.LIST_PROJECTS]: 'Permission to list/browse all projects',

  // Release Management
  [ApiRole.CREATE_RELEASE]: 'Permission to create new releases',
  [ApiRole.VIEW_RELEASE]: 'Permission to view release details',
  [ApiRole.UPDATE_RELEASE]: 'Permission to update existing releases',
  [ApiRole.EDIT_RELEASED_RELEASE]: 'Permission to edit released releases that are in released status',
  [ApiRole.DELETE_RELEASE]: 'Permission to delete releases',
  [ApiRole.PUSH_RELEASE]: 'Permission to push/deploy releases',
  [ApiRole.PUBLISH_RELEASE]: 'Permission to publish releases',
  [ApiRole.LIST_RELEASES]: 'Permission to list/browse all releases',

  // Artifact Management
  [ApiRole.UPLOAD_ARTIFACT]: 'Permission to upload artifacts',
  [ApiRole.DOWNLOAD_ARTIFACT]: 'Permission to download artifacts',
  [ApiRole.DELETE_ARTIFACT]: 'Permission to delete artifacts',
  [ApiRole.VIEW_ARTIFACT]: 'Permission to view artifact details',
  [ApiRole.LIST_ARTIFACTS]: 'Permission to list/browse artifacts',

  // Deployment
  [ApiRole.DEPLOY_DEV]: 'Permission to deploy to development environments',
  [ApiRole.DEPLOY_STAGING]: 'Permission to deploy to staging environments',
  [ApiRole.DEPLOY_PRODUCTION]: 'Permission to deploy to production environments',

  // Discovery & Offerings
  [ApiRole.VIEW_DISCOVERY]: 'Permission to view discovery services and devices',
  [ApiRole.MANAGE_DISCOVERY]: 'Permission to manage discovery services (edit, delete devices)',
  [ApiRole.LINK_PROJECT_DEVICE_TYPE]: 'Permission to link projects to device types',
  [ApiRole.VIEW_OFFERING]: 'Permission to view offerings',
  [ApiRole.CREATE_OFFERING]: 'Permission to create offerings',
  [ApiRole.UPDATE_OFFERING]: 'Permission to update offerings',
  [ApiRole.DELETE_OFFERING]: 'Permission to delete offerings',

  // User Management
  [ApiRole.VIEW_USER]: 'Permission to view user information',
  [ApiRole.MANAGE_USERS]: 'Permission to manage users',

  // Analytics & Monitoring
  [ApiRole.VIEW_ANALYTICS]: 'Permission to view analytics and reports',
  [ApiRole.VIEW_LOGS]: 'Permission to view system logs',
  [ApiRole.VIEW_METRICS]: 'Permission to view system metrics',



  // Policies & Rules Management
  [ApiRole.CREATE_POLICY]: 'Permission to create policies (release-associated rules)',
  [ApiRole.VIEW_POLICY]: 'Permission to view policy details',
  [ApiRole.UPDATE_POLICY]: 'Permission to update existing policies',
  [ApiRole.DELETE_POLICY]: 'Permission to delete policies',
  [ApiRole.LIST_POLICIES]: 'Permission to list/browse all policies',
  [ApiRole.CREATE_RESTRICTION]: 'Permission to create restrictions (device-associated rules)',
  [ApiRole.VIEW_RESTRICTION]: 'Permission to view restriction details',
  [ApiRole.UPDATE_RESTRICTION]: 'Permission to update existing restrictions',
  [ApiRole.DELETE_RESTRICTION]: 'Permission to delete restrictions',
  [ApiRole.LIST_RESTRICTIONS]: 'Permission to list/browse all restrictions',
  [ApiRole.MANAGE_CONFIG]: 'Permission to manage system configuration',
  [ApiRole.VIEW_CONFIG]: 'Permission to view system configuration',

  // Config Revision & Config Map Management
  [ApiRole.VIEW_CONFIG_REVISION]: 'Permission to view config revisions and device config snapshots',
  [ApiRole.MANAGE_CONFIG_REVISION]: 'Permission to manage config revisions (create draft, apply, delete draft)',
  [ApiRole.MANAGE_CONFIG_GROUP]: 'Permission to manage config groups and entries within a draft revision',
  [ApiRole.VIEW_CONFIG_MAP]: 'Permission to view ConfigMap projects and their device-type associations',
  [ApiRole.MANAGE_CONFIG_MAP]: 'Permission to manage ConfigMap associations (add or remove device-type / device-id links)',

  // SBOM
  [ApiRole.CREATE_SBOM_SCAN]: 'Permission to request a new SBOM scan for a docker image, binary file, or directory',
  [ApiRole.VIEW_SBOM_SCAN]: 'Permission to view SBOM scan status, results, and download reports',
  [ApiRole.DELETE_SBOM_SCAN]: 'Permission to delete an SBOM scan (cancels it if still queued)',
  [ApiRole.RETRY_SBOM_SCAN]: 'Permission to retry a failed or completed SBOM scan',
};

/**
 * Interface for role definition
 */
export interface RoleDefinition {
  name: string;
  description: string;
  composite?: boolean;
  compositeRoles?: string[];
}

/**
 * Interface for group definition
 */
export interface GroupDefinition {
  name: string;
  description?: string;
  path?: string;
  compositeRoles: string[]; // Composite roles to assign to this group
  attributes?: Record<string, string[]>;
}

/**
 * Composite roles definitions
 */
export const COMPOSITE_ROLES: RoleDefinition[] = [
  {
    name: 'contributor',
    description: 'Composite role for contributors - can view and create releases, projects, and upload artifacts',
    composite: true,
    compositeRoles: [
      // Projects
      ApiRole.CREATE_PROJECT,
      ApiRole.VIEW_PROJECT,
      ApiRole.UPDATE_PROJECT,
      ApiRole.DELETE_PROJECT,
      ApiRole.LIST_PROJECTS,
      // Releases
      ApiRole.VIEW_RELEASE,
      ApiRole.CREATE_RELEASE,
      ApiRole.UPDATE_RELEASE,
      ApiRole.DELETE_RELEASE,
      ApiRole.PUBLISH_RELEASE,
      ApiRole.LIST_RELEASES,
      // Artifacts
      ApiRole.UPLOAD_ARTIFACT,
      ApiRole.DOWNLOAD_ARTIFACT,
      ApiRole.VIEW_ARTIFACT,
      ApiRole.DELETE_ARTIFACT,
      ApiRole.LIST_ARTIFACTS,
      // View permissions
      ApiRole.VIEW_DISCOVERY,
      ApiRole.VIEW_USER,
      ApiRole.VIEW_ANALYTICS,
      ApiRole.VIEW_LOGS,
      ApiRole.VIEW_METRICS,
      ApiRole.VIEW_CONFIG,
      // Config Revision & Config Map (read-only)
      ApiRole.VIEW_CONFIG_REVISION,
      ApiRole.VIEW_CONFIG_MAP,
      // Policies & Rules
      ApiRole.CREATE_POLICY,
      ApiRole.VIEW_POLICY,
      ApiRole.UPDATE_POLICY,
      ApiRole.DELETE_POLICY,
      ApiRole.LIST_POLICIES,
      
      ApiRole.VIEW_OFFERING,
      // SBOM
      ApiRole.CREATE_SBOM_SCAN,
      ApiRole.VIEW_SBOM_SCAN,
      ApiRole.RETRY_SBOM_SCAN,
      // Enable permissions
      ApiRole.PERMISSIONS_ENABLED,
    ],
  },
  {
    name: 'system-administrator',
    description: 'Composite role for system administrators - can deploy to devices, link projects to device types, manage devices, view analytics and logs',
    composite: true,
    compositeRoles: [
      // Deployment
      ApiRole.DEPLOY_DEV,
      ApiRole.DEPLOY_STAGING,
      ApiRole.DEPLOY_PRODUCTION,
      // Discovery & Device Management
      ApiRole.VIEW_DISCOVERY,
      ApiRole.MANAGE_DISCOVERY,
      ApiRole.LINK_PROJECT_DEVICE_TYPE,
      // Offerings
      ApiRole.CREATE_OFFERING,
      ApiRole.UPDATE_OFFERING,
      ApiRole.DELETE_OFFERING,
      ApiRole.VIEW_OFFERING,
      // Pushing a release to devices
      ApiRole.PUSH_RELEASE,

      // User Management
      ApiRole.VIEW_USER,
      ApiRole.MANAGE_USERS,
      // Analytics & Monitoring
      ApiRole.VIEW_ANALYTICS,
      ApiRole.VIEW_LOGS,
      ApiRole.VIEW_METRICS,
      // Configuration
      ApiRole.MANAGE_CONFIG,
      ApiRole.VIEW_CONFIG,
      // Config Revision & Config Map Management
      ApiRole.VIEW_CONFIG_REVISION,
      ApiRole.MANAGE_CONFIG_REVISION,
      ApiRole.MANAGE_CONFIG_GROUP,
      ApiRole.VIEW_CONFIG_MAP,
      ApiRole.MANAGE_CONFIG_MAP,
      // Policies & Rules Management
      ApiRole.CREATE_POLICY,
      ApiRole.VIEW_POLICY,
      ApiRole.UPDATE_POLICY,
      ApiRole.DELETE_POLICY,
      ApiRole.LIST_POLICIES,
      ApiRole.CREATE_RESTRICTION,
      ApiRole.VIEW_RESTRICTION,
      ApiRole.UPDATE_RESTRICTION,
      ApiRole.DELETE_RESTRICTION,
      ApiRole.LIST_RESTRICTIONS,
      // View permissions (Projects, Releases, Artifacts)
      ApiRole.VIEW_PROJECT,
      ApiRole.LIST_PROJECTS,
      ApiRole.VIEW_RELEASE,
      ApiRole.LIST_RELEASES,
      ApiRole.VIEW_ARTIFACT,
      ApiRole.LIST_ARTIFACTS,
      // SBOM
      ApiRole.CREATE_SBOM_SCAN,
      ApiRole.VIEW_SBOM_SCAN,
      ApiRole.DELETE_SBOM_SCAN,
      ApiRole.RETRY_SBOM_SCAN,
      // Enable permissions
      ApiRole.PERMISSIONS_ENABLED,
    ],
  },
];

/**
 * Group definitions - groups mapped to composite roles
 */
export const GROUP_DEFINITIONS: GroupDefinition[] = [
  {
    name: 'Contributors',
    path: '/Contributors',
    description: 'Users who can contribute to projects - create releases, upload artifacts, and manage projects',
    compositeRoles: ['contributor'],
    attributes: {
      'group-type': ['contributor'],
      'auto-managed': ['true'],
    },
  },
  {
    name: 'System Administrators',
    path: '/System Administrators',
    description: 'Users who can deploy applications, manage devices, and configure the system',
    compositeRoles: ['system-administrator'],
    attributes: {
      'group-type': ['administrator'],
      'auto-managed': ['true'],
    },
  },
];
