import { MemberProjectEntity, ProjectEntity } from "@app/common/database/entities";


export const PROJECT_ACCESS_SERVICE = 'PROJECT_ACCESS_SERVICE'

export interface ProjectAccessService {
  getMemberInProject( projectIdentifier: string | number, email: string): Promise<MemberProjectEntity | null>;
  getProjectFromToken(token: string): Promise<ProjectEntity>;
}