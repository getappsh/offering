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