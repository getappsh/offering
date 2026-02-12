import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { ProjectAccessGuard } from "./project-access.guard";

export const ValidateProjectUserAccess = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('validateProjectUserAccess', true),
    UseGuards(ProjectAccessGuard)
  )
}
export const ValidateProjectTokenAccess = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('validateProjectTokenAccess', true),
    UseGuards(ProjectAccessGuard)
  )
}
export const ValidateProjectAnyAccess = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('validateProjectAnyAccess', true),    
    UseGuards(ProjectAccessGuard)
  )
}

/**
 * Validates that the user has access to all projects referenced in the DTO
 * @param projectExtractor - Function that extracts project names from the request DTO
 * @param roles - Optional roles to check
 */
export const ValidateProjectListAccess = (projectExtractor: string | ((dto: any) => string[]), ...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('validateProjectListAccess', true),
    SetMetadata('projectExtractor', projectExtractor),
    UseGuards(ProjectAccessGuard)
  )
}