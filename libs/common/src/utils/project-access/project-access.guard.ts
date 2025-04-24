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

    const request = extractRequest(context) as Record<string, any>
    const headers = extractHeaders(context)

    const user = headers?.user;
    const projectToken = headers?.projectToken;
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

  private async validateUser(projectIdentifier: string | number, email: string, roles: string[]): Promise<ProjectEntity> {
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

  private async validateProject(projectToken: string, roles: string[]): Promise<ProjectEntity> {
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

}
