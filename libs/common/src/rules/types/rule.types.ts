import { RuleType } from '../enums/rule.enums';
import { ReleaseIdentifierDto, RuleAssociationDto, PolicyAssociationDto, RestrictionAssociationDto } from '../dto';

// Re-export DTOs as types for backward compatibility
export type ReleaseIdentifier = ReleaseIdentifierDto;
export type RuleAssociation = RuleAssociationDto;
export type PolicyAssociation = PolicyAssociationDto;
export type RestrictionAssociation = RestrictionAssociationDto;

export interface RuleDefinition {
  id: string;
  name: string;
  description?: string;
  type: RuleType;
  association: RuleAssociation;
  version: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  rule: any; // The actual rule object conforming to @usex/rule-engine
}

export interface RuleFieldDefinition {
  name: string;
  type: string;
  label: string;
  description?: string;
}
