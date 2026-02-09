import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectAccessService, PROJECT_ACCESS_SERVICE } from './project-access.service';
import { extractHeaders, extractRequest } from '@app/common/microservice-client';
import { ProjectEntity } from '@app/common/database/entities';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  private readonly logger =  new Logger(ProjectAccessGuard.name)
  
  constructor(
      private readonly reflector: Reflector,
      @Inject(PROJECT_ACCESS_SERVICE) private readonly accessService: ProjectAccessService,
      
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const validateUserToken = this.reflector.get<boolean>('validateProjectUserAccess', context.getHandler());
    const validateProjectToken = this.reflector.get<boolean>('validateProjectTokenAccess', context.getHandler());
    const validateAnyToken = this.reflector.get<boolean>('validateProjectAnyAccess', context.getHandler());
    const validateProjectList = this.reflector.get<boolean>('validateProjectListAccess', context.getHandler());
    const projectExtractor = this.reflector.get<string | ((dto: any) => string[])>('projectExtractor', context.getHandler());

    const request = extractRequest(context) as Record<string, any>
    const headers = extractHeaders(context)

    const user = headers?.user;
    const projectToken = headers?.projectToken;

    // Handle project list validation
    if (validateProjectList) {
      return this.validateProjectList(request, projectExtractor, projectToken, user?.email, roles);
    }

    // Handle single project validation (existing logic)
    const projectIdentifier = request.projectIdentifier ?? request?.projectId;
    
    if (!projectIdentifier){
        throw new ForbiddenException(`Project Identifier is not found in the request.`);
    }


    let project
    if (validateUserToken){
      project = await this.validateUser(projectIdentifier, user?.email, roles)

    }else if (validateProjectToken) {
      project = await this.validateProject(projectToken, roles);
        
    }else if (validateAnyToken ) {
      project = await this.validateAny(projectIdentifier, projectToken, user?.email, roles);
    }


    if (!project || (project.id != projectIdentifier && project.name != projectIdentifier)){
      throw new ForbiddenException(`Not allowed in this project: ${projectIdentifier}`)
    }

    request.projectId = project.id;
    request.project = project;
    return true
  }

  private async validateUser(projectIdentifier: string | number, email: string, roles: string[]): Promise<ProjectEntity | undefined> {
    if (!email) return;
      const memberProject = await this.accessService.getMemberInProject(projectIdentifier, email);
      if (!memberProject){
        throw new ForbiddenException(`User ${email} is not a member of the project.`);
    }

    if (roles?.length > 0) {
      const hasRole = roles.some(role => role == memberProject?.role);
      if (!hasRole)
        throw new ForbiddenException(`User ${email} does not have the required role.`);
      
    }

    return memberProject.project
  }

  private async validateProject(projectToken: string, roles: string[]): Promise<ProjectEntity | undefined> {
    if (!projectToken) return;
    // TODO: Validate role for project token

    return await this.accessService.getProjectFromToken(projectToken);
  }

  private async validateAny(projectIdentifier: string | number, projectToken: string, email: string, roles: string[]): Promise<ProjectEntity> {
    let project;
    if (projectToken){
      project = await this.validateProject(projectToken, roles).catch(null);
    }
    if (email && !project){
      project = await this.validateUser(projectIdentifier, email, roles).catch(null);
    }

    return project
  }

  /**
   * Validates that the user has access to all projects in the list
   */
  private async validateProjectList(
    request: Record<string, any>,
    projectExtractor: string | ((dto: any) => string[]),
    projectToken: string,
    email: string,
    roles: string[]
  ): Promise<boolean> {
    // Extract project names from the DTO
    let projectNames: string[];
    
    if (typeof projectExtractor === 'function') {
      projectNames = projectExtractor(request);
    } else {
      // Use dot notation to extract nested property (e.g., "association.releases")
      const parts = projectExtractor.split('.');
      let value = request;
      for (const part of parts) {
        value = value?.[part];
        if (!value) break;
      }
      
      if (Array.isArray(value)) {
        // Assume it's an array of objects with projectName property
        projectNames = value.map(item => item.projectName).filter(Boolean);
      } else {
        throw new ForbiddenException('Unable to extract project names from request');
      }
    }

    // Get unique project names
    const uniqueProjectNames = [...new Set(projectNames)];
    
    if (uniqueProjectNames.length === 0) {
      throw new ForbiddenException('Request must be associated with at least one project');
    }

    // Validate access for each project
    for (const projectName of uniqueProjectNames) {
      let hasAccess = false;
      
      // Try validating with project token first
      if (projectToken) {
        try {
          const project = await this.accessService.getProjectFromToken(projectToken);
          if (project && (project.name === projectName || project.id.toString() === projectName)) {
            hasAccess = true;
          }
        } catch (error) {
          // Continue to user validation
        }
      }
      
      // Try validating with user email
      if (!hasAccess && email) {
        try {
          const memberProject = await this.accessService.getMemberInProject(projectName, email);
          if (memberProject && memberProject.project) {
            hasAccess = true;
          }
        } catch (error) {
          // User doesn't have access
        }
      }
      
      if (!hasAccess) {
        throw new ForbiddenException(
          `User does not have permission to access project: ${projectName}`
        );
      }
    }

    return true;
  }

}
