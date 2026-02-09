import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ApiRole } from '../permissions/constants/roles.enum';
import {
  COMPOSITE_ROLES,
  GROUP_DEFINITIONS,
  GroupDefinition,
  ROLE_DESCRIPTIONS,
  RoleDefinition,
} from './constants/role-definitions.constant';
import { OidcGroup, OidcRole } from './interfaces/oidc-role.interface';

/**
 * Service for managing OIDC roles
 * Provides functionality to create, get, delete roles and sync all roles on startup
 */
@Injectable()
export class OidcRolesService implements OnModuleInit {
  private readonly logger = new Logger(OidcRolesService.name);
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private clientUuid: string | null = null;

  private readonly oidcUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly adminUser: string;
  private readonly adminPassword: string;
  private readonly autoSync: boolean;

  constructor(private readonly configService: ConfigService) {
    this.oidcUrl = this.configService.get<string>('KEYCLOAK_URL', 'http://localhost:8080');
    this.realm = this.configService.get<string>('KEYCLOAK_REALM', 'getapp');
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID', 'api');
    this.adminUser = this.configService.get<string>('KEYCLOAK_ADMIN_USER', 'admin');
    this.adminPassword = this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD', 'admin');
    this.autoSync = this.configService.get<boolean>('KEYCLOAK_AUTO_SYNC_ROLES', true);

    this.axiosInstance = axios.create({
      baseURL: this.oidcUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initialize module and sync roles on startup if auto-sync is enabled
   */
  async onModuleInit() {
    if (this.autoSync) {
      try {
        this.logger.log('🔄 Auto-sync is ENABLED - Starting automatic role synchronization...');
        this.logger.log('');
        await this.setupAllRoles();
        this.logger.log('✅ Automatic role synchronization completed successfully');
      } catch (error) {
        this.logger.error('❌ Failed to sync OIDC roles on startup:', error);
        this.logger.warn('⚠️  Service will continue to start, but roles may not be in sync');
        // Don't throw - allow service to start even if OIDC sync fails
      }
    } else {
      this.logger.log('⏸️  Auto-sync is DISABLED - Skipping automatic role synchronization');
      this.logger.log('ℹ️  Set KEYCLOAK_AUTO_SYNC_ROLES=true to enable automatic sync on startup');
    }
  }

  /**
   * Get admin access token
   */
  private async getAdminToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    this.logger.debug('Authenticating with OIDC Admin...');

    try {
      const response = await this.axiosInstance.post(
        `/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: this.adminUser,
          password: this.adminPassword,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
      this.logger.debug('Successfully authenticated with OIDC provider');
      return this.accessToken as string;
    } catch (error: any) {
      this.logger.error('Failed to authenticate with OIDC provider', error.response?.data || error.message);
      throw new Error(`OIDC authentication failed: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Get client UUID by client ID
   */
  private async getClientUuid(): Promise<string> {
    if (this.clientUuid) {
      return this.clientUuid;
    }

    await this.getAdminToken();

    this.logger.debug(`Finding client: ${this.clientId}...`);

    try {
      const response = await this.axiosInstance.get(
        `/admin/realms/${this.realm}/clients?clientId=${this.clientId}`
      );

      if (!response.data || response.data.length === 0) {
        throw new Error(`Client '${this.clientId}' not found in realm '${this.realm}'`);
      }

      this.clientUuid = response.data[0].id;
      this.logger.debug(`Found client UUID: ${this.clientUuid}`);
      return this.clientUuid as string;
    } catch (error: any) {
      this.logger.error('Failed to find client', error.response?.data || error.message);
      throw new Error(`Failed to find OIDC client: ${error.message}`);
    }
  }

  /**
   * Get all existing roles for the client
   */
  async getRoles(): Promise<OidcRole[]> {
    const clientUuid = await this.getClientUuid();

    try {
      const response = await this.axiosInstance.get(
        `/admin/realms/${this.realm}/clients/${clientUuid}/roles`
      );

      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to get roles', error.response?.data || error.message);
      throw new Error(`Failed to get roles: ${error.message}`);
    }
  }

  /**
   * Get a specific role by name
   */
  async getRole(roleName: string): Promise<OidcRole> {
    const clientUuid = await this.getClientUuid();

    try {
      const response = await this.axiosInstance.get(
        `/admin/realms/${this.realm}/clients/${clientUuid}/roles/${roleName}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Role '${roleName}' not found`);
      }
      this.logger.error(`Failed to get role ${roleName}`, error.response?.data || error.message);
      throw new Error(`Failed to get role: ${error.message}`);
    }
  }

  /**
   * Create a single role
   * @returns true if created, false if already exists
   */
  async createRole(roleName: string, description: string): Promise<boolean> {
    const clientUuid = await this.getClientUuid();

    try {
      await this.axiosInstance.post(
        `/admin/realms/${this.realm}/clients/${clientUuid}/roles`,
        {
          name: roleName,
          description: description,
          composite: false,
          clientRole: true,
        }
      );
      this.logger.debug(`Created role: ${roleName}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Role already exists
        this.logger.debug(`Role '${roleName}' already exists`);
        return false;
      }
      this.logger.error(`Failed to create role ${roleName}`, error.response?.data || error.message);
      throw new Error(`Failed to create role: ${error.message}`);
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(roleName: string): Promise<void> {
    const clientUuid = await this.getClientUuid();

    try {
      await this.axiosInstance.delete(
        `/admin/realms/${this.realm}/clients/${clientUuid}/roles/${roleName}`
      );
      this.logger.debug(`Deleted role: ${roleName}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.logger.debug(`Role '${roleName}' not found, skipping deletion`);
        return;
      }
      this.logger.error(`Failed to delete role ${roleName}`, error.response?.data || error.message);
      throw new Error(`Failed to delete role: ${error.message}`);
    }
  }

  /**
   * Get all groups in the realm
   */
  async getGroups(): Promise<OidcGroup[]> {
    await this.getAdminToken();

    try {
      const response = await this.axiosInstance.get(
        `/admin/realms/${this.realm}/groups`
      );
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to get groups', error.response?.data || error.message);
      throw new Error(`Failed to get groups: ${error.message}`);
    }
  }

  /**
   * Get a specific group by name
   */
  async getGroupByName(groupName: string): Promise<OidcGroup | null> {
    const groups = await this.getGroups();
    
    // Search recursively through groups and subgroups
    const findGroup = (groups: OidcGroup[], name: string): OidcGroup | null => {
      for (const group of groups) {
        if (group.name === name) {
          return group;
        }
        if (group.subGroups && group.subGroups.length > 0) {
          const found = findGroup(group.subGroups, name);
          if (found) return found;
        }
      }
      return null;
    };

    return findGroup(groups, groupName);
  }

  /**
   * Get a specific group by ID
   */
  async getGroupById(groupId: string): Promise<OidcGroup> {
    await this.getAdminToken();

    try {
      const response = await this.axiosInstance.get(
        `/admin/realms/${this.realm}/groups/${groupId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Group with ID '${groupId}' not found`);
      }
      this.logger.error(`Failed to get group ${groupId}`, error.response?.data || error.message);
      throw new Error(`Failed to get group: ${error.message}`);
    }
  }

  /**
   * Create a new group
   * @returns the created group's ID
   */
  async createGroup(groupName: string, attributes?: Record<string, string[]>): Promise<string> {
    await this.getAdminToken();

    try {
      const response = await this.axiosInstance.post(
        `/admin/realms/${this.realm}/groups`,
        {
          name: groupName,
          attributes: attributes || {},
        }
      );

      // Get the group ID from the Location header
      const locationHeader = response.headers['location'];
      if (locationHeader) {
        const groupId = locationHeader.split('/').pop();
        this.logger.debug(`Created group: ${groupName} (ID: ${groupId})`);
        return groupId;
      }

      // Fallback: search for the group we just created
      const group = await this.getGroupByName(groupName);
      if (group?.id) {
        return group.id;
      }

      throw new Error('Failed to get created group ID');
    } catch (error: any) {
      if (error.response?.status === 409) {
        this.logger.debug(`Group '${groupName}' already exists`);
        const group = await this.getGroupByName(groupName);
        if (group?.id) {
          return group.id;
        }
      }
      this.logger.error(`Failed to create group ${groupName}`, error.response?.data || error.message);
      throw new Error(`Failed to create group: ${error.message}`);
    }
  }

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string): Promise<void> {
    await this.getAdminToken();

    try {
      await this.axiosInstance.delete(
        `/admin/realms/${this.realm}/groups/${groupId}`
      );
      this.logger.debug(`Deleted group: ${groupId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.logger.debug(`Group '${groupId}' not found, skipping deletion`);
        return;
      }
      this.logger.error(`Failed to delete group ${groupId}`, error.response?.data || error.message);
      throw new Error(`Failed to delete group: ${error.message}`);
    }
  }

  /**
   * Update group attributes
   */
  async updateGroupAttributes(groupId: string, attributes: Record<string, string[]>): Promise<void> {
    await this.getAdminToken();

    try {
      const group = await this.getGroupById(groupId);
      await this.axiosInstance.put(
        `/admin/realms/${this.realm}/groups/${groupId}`,
        {
          ...group,
          attributes,
        }
      );
      this.logger.debug(`Updated attributes for group: ${groupId}`);
    } catch (error: any) {
      this.logger.error(`Failed to update group attributes ${groupId}`, error.response?.data || error.message);
      throw new Error(`Failed to update group attributes: ${error.message}`);
    }
  }

  /**
   * Get client roles assigned to a group
   */
  async getGroupClientRoles(groupId: string): Promise<OidcRole[]> {
    const clientUuid = await this.getClientUuid();

    try {
      const response = await this.axiosInstance.get(
        `/admin/realms/${this.realm}/groups/${groupId}/role-mappings/clients/${clientUuid}`
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to get client roles for group ${groupId}`, error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Assign client roles to a group
   */
  async assignRolesToGroup(groupId: string, roles: OidcRole[]): Promise<void> {
    const clientUuid = await this.getClientUuid();

    if (roles.length === 0) {
      return;
    }

    try {
      await this.axiosInstance.post(
        `/admin/realms/${this.realm}/groups/${groupId}/role-mappings/clients/${clientUuid}`,
        roles
      );
      this.logger.debug(`Assigned ${roles.length} role(s) to group ${groupId}: ${roles.map(r => r.name).join(', ')}`);
    } catch (error: any) {
      this.logger.error(`Failed to assign roles to group ${groupId}`, error.response?.data || error.message);
      throw new Error(`Failed to assign roles to group: ${error.message}`);
    }
  }

  /**
   * Remove client roles from a group
   */
  async removeRolesFromGroup(groupId: string, roles: OidcRole[]): Promise<void> {
    const clientUuid = await this.getClientUuid();

    if (roles.length === 0) {
      return;
    }

    try {
      await this.axiosInstance.delete(
        `/admin/realms/${this.realm}/groups/${groupId}/role-mappings/clients/${clientUuid}`,
        { data: roles }
      );
      this.logger.debug(`Removed ${roles.length} role(s) from group ${groupId}: ${roles.map(r => r.name).join(', ')}`);
    } catch (error: any) {
      this.logger.error(`Failed to remove roles from group ${groupId}`, error.response?.data || error.message);
      throw new Error(`Failed to remove roles from group: ${error.message}`);
    }
  }

  /**
   * Get current composite roles for a given role
   */
  private async getCompositeRoles(roleName: string): Promise<OidcRole[]> {
    const clientUuid = await this.getClientUuid();

    try {
      const response = await this.axiosInstance.get(
        `/admin/realms/${this.realm}/clients/${clientUuid}/roles/${roleName}/composites`
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to get composite roles for ${roleName}`, error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Remove composite roles from a parent role
   */
  private async removeCompositeRoles(parentRoleName: string, rolesToRemove: OidcRole[]): Promise<void> {
    const clientUuid = await this.getClientUuid();

    if (rolesToRemove.length === 0) {
      return;
    }

    try {
      await this.axiosInstance.delete(
        `/admin/realms/${this.realm}/clients/${clientUuid}/roles/${parentRoleName}/composites`,
        { data: rolesToRemove }
      );
      this.logger.log(`   ➖ Removed ${rolesToRemove.length} obsolete composite role(s) from '${parentRoleName}': ${rolesToRemove.map(r => r.name).join(', ')}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to remove composites from '${parentRoleName}':`,
        error.response?.data?.errorMessage || error.message
      );
    }
  }

  /**
   * Create/update composite role with child roles
   * Adds missing roles and removes obsolete ones
   */
  private async createCompositeRole(roleDefinition: RoleDefinition): Promise<void> {
    const clientUuid = await this.getClientUuid();

    this.logger.log(`\n📦 Syncing composite role: '${roleDefinition.name}'`);
    this.logger.log(`   Description: ${roleDefinition.description}`);

    // First create the role if it doesn't exist
    const created = await this.createRole(roleDefinition.name, roleDefinition.description);

    if (created) {
      this.logger.log(`   ✅ Created new composite role: '${roleDefinition.name}'`);
    } else {
      this.logger.log(`   ℹ️  Role already exists, syncing composite roles...`);
    }

    // Get the role details
    const role = await this.getRole(roleDefinition.name);

    // Get current composite roles
    const currentComposites = await this.getCompositeRoles(roleDefinition.name);
    const currentCompositeNames = new Set(currentComposites.map(r => r.name));
    
    this.logger.log(`   📋 Current composite roles (${currentComposites.length}): ${currentComposites.length > 0 ? currentComposites.map(r => r.name).join(', ') : 'none'}`);

    // Get desired child roles
    const desiredRoleNames = new Set(roleDefinition.compositeRoles || []);
    this.logger.log(`   🎯 Desired composite roles (${desiredRoleNames.size}): ${desiredRoleNames.size > 0 ? Array.from(desiredRoleNames).join(', ') : 'none'}`);

    // Find roles to add (desired but not current)
    const rolesToAdd: OidcRole[] = [];
    const missingRoles: string[] = [];
    
    for (const childRoleName of desiredRoleNames) {
      if (!currentCompositeNames.has(childRoleName)) {
        try {
          const childRole = await this.getRole(childRoleName);
          rolesToAdd.push(childRole);
        } catch (error) {
          missingRoles.push(childRoleName);
          this.logger.warn(`   ⚠️  Child role '${childRoleName}' not found in OIDC provider, skipping...`);
        }
      }
    }

    // Find roles to remove (current but not desired)
    const rolesToRemove = currentComposites.filter(r => !desiredRoleNames.has(r.name));

    // Remove obsolete roles first
    if (rolesToRemove.length > 0) {
      await this.removeCompositeRoles(roleDefinition.name, rolesToRemove);
    } else {
      this.logger.log(`   ✓ No obsolete roles to remove`);
    }

    // Add new roles
    if (rolesToAdd.length > 0) {
      try {
        await this.axiosInstance.post(
          `/admin/realms/${this.realm}/clients/${clientUuid}/roles/${role.name}/composites`,
          rolesToAdd
        );
        this.logger.log(`   ➕ Added ${rolesToAdd.length} missing composite role(s) to '${roleDefinition.name}': ${rolesToAdd.map(r => r.name).join(', ')}`);
      } catch (error: any) {
        this.logger.error(
          `   ❌ Failed to add composites to '${roleDefinition.name}':`,
          error.response?.data?.errorMessage || error.message
        );
      }
    } else {
      this.logger.log(`   ✓ No new roles to add`);
    }

    // Summary
    const finalStatus = rolesToAdd.length === 0 && rolesToRemove.length === 0 
      ? '✅ Already in sync' 
      : `✅ Synced (${rolesToAdd.length} added, ${rolesToRemove.length} removed)`;
    this.logger.log(`   ${finalStatus}`);
    
    if (missingRoles.length > 0) {
      this.logger.warn(`   ⚠️  ${missingRoles.length} role(s) not found: ${missingRoles.join(', ')}`);
    }
  }

  /**
   * Sync a group with its composite roles
   * Creates the group if it doesn't exist and assigns/removes roles as needed
   */
  private async syncGroup(groupDefinition: GroupDefinition): Promise<void> {
    this.logger.log(`\n👥 Syncing group: '${groupDefinition.name}'`);
    if (groupDefinition.description) {
      this.logger.log(`   Description: ${groupDefinition.description}`);
    }

    // Check if group exists, create if not
    let group = await this.getGroupByName(groupDefinition.name);
    let groupId: string;

    if (!group) {
      this.logger.log(`   ✅ Creating new group: '${groupDefinition.name}'`);
      groupId = await this.createGroup(groupDefinition.name, groupDefinition.attributes);
      group = await this.getGroupById(groupId);
    } else {
      groupId = group.id!;
      this.logger.log(`   ℹ️  Group already exists, syncing roles...`);

      // Update attributes if needed
      if (groupDefinition.attributes) {
        await this.updateGroupAttributes(groupId, groupDefinition.attributes);
        this.logger.log(`   ✓ Updated group attributes`);
      }
    }

    // Get current roles assigned to group
    const currentRoles = await this.getGroupClientRoles(groupId);
    const currentRoleNames = new Set(currentRoles.map(r => r.name));

    this.logger.log(`   📋 Current roles (${currentRoles.length}): ${currentRoles.length > 0 ? currentRoles.map(r => r.name).join(', ') : 'none'}`);

    // Get desired composite roles
    const desiredRoleNames = new Set(groupDefinition.compositeRoles);
    this.logger.log(`   🎯 Desired roles (${desiredRoleNames.size}): ${Array.from(desiredRoleNames).join(', ')}`);

    // Find roles to add (desired but not current)
    const rolesToAdd: OidcRole[] = [];
    const missingRoles: string[] = [];

    for (const roleName of desiredRoleNames) {
      if (!currentRoleNames.has(roleName)) {
        try {
          const role = await this.getRole(roleName);
          rolesToAdd.push(role);
        } catch (error) {
          missingRoles.push(roleName);
          this.logger.warn(`   ⚠️  Role '${roleName}' not found in OIDC provider, skipping...`);
        }
      }
    }

    // Find roles to remove (current but not desired)
    const rolesToRemove = currentRoles.filter(r => !desiredRoleNames.has(r.name));

    // Remove obsolete roles first
    if (rolesToRemove.length > 0) {
      await this.removeRolesFromGroup(groupId, rolesToRemove);
      this.logger.log(`   ➖ Removed ${rolesToRemove.length} obsolete role(s): ${rolesToRemove.map(r => r.name).join(', ')}`);
    } else {
      this.logger.log(`   ✓ No obsolete roles to remove`);
    }

    // Add new roles
    if (rolesToAdd.length > 0) {
      await this.assignRolesToGroup(groupId, rolesToAdd);
      this.logger.log(`   ➕ Assigned ${rolesToAdd.length} missing role(s): ${rolesToAdd.map(r => r.name).join(', ')}`);
    } else {
      this.logger.log(`   ✓ No new roles to assign`);
    }

    // Summary
    const finalStatus = rolesToAdd.length === 0 && rolesToRemove.length === 0 
      ? '✅ Already in sync' 
      : `✅ Synced (${rolesToAdd.length} added, ${rolesToRemove.length} removed)`;
    this.logger.log(`   ${finalStatus}`);

    if (missingRoles.length > 0) {
      this.logger.warn(`   ⚠️  ${missingRoles.length} role(s) not found: ${missingRoles.join(', ')}`);
    }
  }

  /**
   * Setup all roles - creates missing basic roles and composite roles
   * This is the main function to sync all roles with OIDC provider
   */
  async setupAllRoles(): Promise<{
    basicRoles: { created: number; skipped: number };
    compositeRoles: { created: number; failed: number };
    groups: { synced: number; failed: number };
  }> {
    this.logger.log('🚀 ========================================');
    this.logger.log('🚀 Starting OIDC Role Synchronization');
    this.logger.log('🚀 ========================================');
    this.logger.log(`📍 OIDC URL: ${this.oidcUrl}`);
    this.logger.log(`📍 Realm: ${this.realm}`);
    this.logger.log(`📍 Client ID: ${this.clientId}`);
    this.logger.log('');

    // Authenticate and get client UUID
    this.logger.log('🔐 Authenticating with OIDC Admin...');
    await this.getAdminToken();
    this.logger.log('✅ Authentication successful');
    this.logger.log('');

    this.logger.log('🔍 Finding client in OIDC provider...');
    await this.getClientUuid();
    this.logger.log(`✅ Client found: ${this.clientUuid}`);
    this.logger.log('');

    // Get existing roles
    this.logger.log('📋 Fetching existing roles...');
    const existingRoles = await this.getRoles();
    const existingRoleNames = existingRoles.map(r => r.name);
    this.logger.log(`✅ Found ${existingRoles.length} existing role(s) in OIDC provider`);
    if (existingRoles.length > 0) {
      this.logger.log(`   Current roles: ${existingRoleNames.slice(0, 10).join(', ')}${existingRoles.length > 10 ? '...' : ''}`);
    }
    this.logger.log('');

    // Create all basic roles from enum
    this.logger.log('📝 ========================================');
    this.logger.log('📝 Synchronizing Basic Roles');
    this.logger.log('📝 ========================================');
    const allRoles = Object.values(ApiRole);
    this.logger.log(`🎯 Total basic roles defined: ${allRoles.length}`);
    this.logger.log('');
    
    let createdCount = 0;
    let skippedCount = 0;

    for (const role of allRoles) {
      const description = ROLE_DESCRIPTIONS[role];
      
      if (!description) {
        this.logger.warn(`   ⚠️  Missing description for role: ${role} - using default`);
      }
      
      const finalDescription = description || `Role: ${role}`;

      try {
        const created = await this.createRole(role, finalDescription);
        if (created) {
          this.logger.log(`   ✅ Created: ${role}`);
          createdCount++;
        } else {
          this.logger.debug(`   ⏭️  Skipped (exists): ${role}`);
          skippedCount++;
        }
      } catch (error: any) {
        this.logger.error(`   ❌ Failed to create ${role}: ${error.message}`);
      }
    }

    this.logger.log('');
    this.logger.log(`📊 Basic Roles Summary:`);
    this.logger.log(`   ✅ Created: ${createdCount}`);
    this.logger.log(`   ⏭️  Skipped (already existed): ${skippedCount}`);
    this.logger.log(`   📈 Total: ${allRoles.length}`);
    this.logger.log('');

    // Create composite roles
    this.logger.log('📦 ========================================');
    this.logger.log('📦 Synchronizing Composite Roles');
    this.logger.log('📦 ========================================');
    this.logger.log(`🎯 Total composite roles defined: ${COMPOSITE_ROLES.length}`);
    
    let compositeCreated = 0;
    let compositeFailed = 0;

    for (const compositeRole of COMPOSITE_ROLES) {
      try {
        await this.createCompositeRole(compositeRole);
        compositeCreated++;
      } catch (error: any) {
        this.logger.error(`\n❌ Failed to create composite role '${compositeRole.name}': ${error.message}`);
        compositeFailed++;
      }
    }

    this.logger.log('');
    this.logger.log(`📊 Composite Roles Summary:`);
    this.logger.log(`   ✅ Processed successfully: ${compositeCreated}`);
    this.logger.log(`   ❌ Failed: ${compositeFailed}`);
    this.logger.log(`   📈 Total: ${COMPOSITE_ROLES.length}`);
    this.logger.log('');

    // Sync groups with composite roles
    this.logger.log('👥 ========================================');
    this.logger.log('👥 Synchronizing Groups');
    this.logger.log('👥 ========================================');
    this.logger.log(`🎯 Total groups defined: ${GROUP_DEFINITIONS.length}`);
    
    let groupsSynced = 0;
    let groupsFailed = 0;

    for (const groupDef of GROUP_DEFINITIONS) {
      try {
        await this.syncGroup(groupDef);
        groupsSynced++;
      } catch (error: any) {
        this.logger.error(`\n❌ Failed to sync group '${groupDef.name}': ${error.message}`);
        groupsFailed++;
      }
    }

    this.logger.log('');
    this.logger.log(`📊 Groups Summary:`);
    this.logger.log(`   ✅ Synced successfully: ${groupsSynced}`);
    this.logger.log(`   ❌ Failed: ${groupsFailed}`);
    this.logger.log(`   📈 Total: ${GROUP_DEFINITIONS.length}`);
    this.logger.log('');

    // Final summary
    const finalRoles = await this.getRoles();
    const finalGroups = await this.getGroups();
    this.logger.log('🎉 ========================================');
    this.logger.log('🎉 Synchronization Complete!');
    this.logger.log('🎉 ========================================');
    this.logger.log(`📊 Final Statistics:`);
    this.logger.log(`   📋 Total roles in OIDC provider: ${finalRoles.length}`);
    this.logger.log(`   👥 Total groups in OIDC provider: ${finalGroups.length}`);
    this.logger.log(`   📝 Basic roles defined: ${allRoles.length}`);
    this.logger.log(`   📦 Composite roles defined: ${COMPOSITE_ROLES.length}`);
    this.logger.log(`   👥 Groups defined: ${GROUP_DEFINITIONS.length}`);
    this.logger.log(`   ✅ Basic roles created: ${createdCount}`);
    this.logger.log(`   ✅ Composite roles synced: ${compositeCreated}`);
    this.logger.log(`   ✅ Groups synced: ${groupsSynced}`);
    this.logger.log('🎉 ========================================');
    this.logger.log('');

    return {
      basicRoles: { created: createdCount, skipped: skippedCount },
      compositeRoles: { created: compositeCreated, failed: compositeFailed },
      groups: { synced: groupsSynced, failed: groupsFailed },
    };
  }
}
