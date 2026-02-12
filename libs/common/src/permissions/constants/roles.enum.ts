/**
 * API Roles for permission-based authorization
 * These roles should be configured in Keycloak under resource_access.api.roles
 */
export enum ApiRole {
  // ========== PROJECT MANAGEMENT ==========
  /**
   * Permission to create new projects
   */
  CREATE_PROJECT = 'create-project',

  /**
   * Permission to view project details
   */
  VIEW_PROJECT = 'view-project',

  /**
   * Permission to update existing projects
   */
  UPDATE_PROJECT = 'update-project',

  /**
   * Permission to delete projects
   */
  DELETE_PROJECT = 'delete-project',

  /**
   * Permission to list/browse all projects
   */
  LIST_PROJECTS = 'list-projects',

  // ========== RELEASE MANAGEMENT ==========
  /**
   * Permission to create new releases
   */
  CREATE_RELEASE = 'create-release',

  /**
   * Permission to view release details
   */
  VIEW_RELEASE = 'view-release',

  /**
   * Permission to update existing releases
   */
  UPDATE_RELEASE = 'update-release',

  /**
   * Permission to edit imported releases that are in released status
   * This is a special permission for users who can modify imported releases
   */
  EDIT_IMPORTED_RELEASE = 'edit-imported-release',

  /**
   * Permission to delete releases
   */
  DELETE_RELEASE = 'delete-release',


  /**
   * Permission to push/deploy releases
   */
  PUSH_RELEASE = 'push-release',

  /**
   * Permission to publish releases
   */
  PUBLISH_RELEASE = 'publish-release',

  /**
   * Permission to list/browse all releases
   */
  LIST_RELEASES = 'list-releases',

  // ========== ARTIFACT MANAGEMENT ==========
  /**
   * Permission to upload artifacts
   */
  UPLOAD_ARTIFACT = 'upload-artifact',

  /**
   * Permission to download artifacts
   */
  DOWNLOAD_ARTIFACT = 'download-artifact',

  /**
   * Permission to delete artifacts
   */
  DELETE_ARTIFACT = 'delete-artifact',

  /**
   * Permission to view artifact details
   */
  VIEW_ARTIFACT = 'view-artifact',

  /**
   * Permission to list/browse artifacts
   */
  LIST_ARTIFACTS = 'list-artifacts',

  // ========== DEPLOYMENT ==========
  /**
   * Permission to deploy to development environments
   */
  DEPLOY_DEV = 'deploy-dev',

  /**
   * Permission to deploy to staging environments
   */
  DEPLOY_STAGING = 'deploy-staging',

  /**
   * Permission to deploy to production environments
   */
  DEPLOY_PRODUCTION = 'deploy-production',

  // ========== DISCOVERY & OFFERINGS ==========
  /**
   * Permission to view discovery services and devices
   */
  VIEW_DISCOVERY = 'view-discovery',

  /**
   * Permission to manage discovery services (edit, delete devices)
   */
  MANAGE_DISCOVERY = 'manage-discovery',

  /**
   * Permission to link projects to device types
   */
  LINK_PROJECT_DEVICE_TYPE = 'link-project-device-type',

   /**
   * Permission to view offerings
   */
  VIEW_OFFERING = 'view-offering',

  /**
   * Permission to create offerings
   */
  CREATE_OFFERING = 'create-offering',

  /**
   * Permission to update offerings
   */
  UPDATE_OFFERING = 'update-offering',

  /**
   * Permission to delete offerings
   */
  DELETE_OFFERING = 'delete-offering',

  // ========== USER MANAGEMENT ==========
  /**
   * Permission to view user information
   */
  VIEW_USER = 'view-user',

  /**
   * Permission to manage users
   */
  MANAGE_USERS = 'manage-users',

  // ========== ANALYTICS & MONITORING ==========
  /**
   * Permission to view analytics and reports
   */
  VIEW_ANALYTICS = 'view-analytics',

  /**
   * Permission to view system logs
   */
  VIEW_LOGS = 'view-logs',

  /**
   * Permission to view system metrics
   */
  VIEW_METRICS = 'view-metrics',

  // ========== CONFIGURATION ==========
  /**
   * Permission to manage system configuration
   */
  MANAGE_CONFIG = 'manage-config',

  /**
   * Permission to view system configuration
   */
  VIEW_CONFIG = 'view-config',

  // ========== POLICIES & RULES MANAGEMENT ==========
  /**
   * Permission to create policies (release-associated rules)
   */
  CREATE_POLICY = 'create-policy',

  /**
   * Permission to view policy details
   */
  VIEW_POLICY = 'view-policy',

  /**
   * Permission to update existing policies
   */
  UPDATE_POLICY = 'update-policy',

  /**
   * Permission to delete policies
   */
  DELETE_POLICY = 'delete-policy',

  /**
   * Permission to list/browse all policies
   */
  LIST_POLICIES = 'list-policies',

  /**
   * Permission to create restrictions (device-associated rules)
   */
  CREATE_RESTRICTION = 'create-restriction',

  /**
   * Permission to view restriction details
   */
  VIEW_RESTRICTION = 'view-restriction',

  /**
   * Permission to update existing restrictions
   */
  UPDATE_RESTRICTION = 'update-restriction',

  /**
   * Permission to delete restrictions
   */
  DELETE_RESTRICTION = 'delete-restriction',

  /**
   * Permission to list/browse all restrictions
   */
  LIST_RESTRICTIONS = 'list-restrictions',

  // ========== SPECIAL STAMP ==========
  /**
   * Special stamp role that enables permission validation when present
   * This role acts as a feature flag to enable permission checking
   */
  PERMISSIONS_ENABLED = 'permissions-enabled',
}

/**
 * Type for any valid API role
 */
export type ApiRoleType = `${ApiRole}`;
