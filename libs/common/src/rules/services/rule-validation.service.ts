import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuleFieldEntity } from '../../database/entities/rule-field.entity';
import { AppError, ErrorCode } from '../../dto/error';

@Injectable()
export class RuleValidationService {
  private ruleEnginePromise: Promise<any>;

  constructor(
    @InjectRepository(RuleFieldEntity)
    private readonly ruleFieldRepository: Repository<RuleFieldEntity>,
  ) {
    // Dynamically import @usex/rule-engine as ES module using the ESM entry point
    // Use eval to prevent webpack from converting import() to require()
    this.ruleEnginePromise = (0, eval)("import('@usex/rule-engine/dist/esm/index.js')").then(module => module.RuleEngine);
  }

  /**
   * Validates a rule against the rule engine and checks field existence
   */
  async validateRule(rule: any): Promise<void> {
    // Step 1: Validate against rule engine
    try {
      // Get RuleEngine class from dynamic import
      const RuleEngine = await this.ruleEnginePromise;
      
      // Get singleton instance of rule engine
      const ruleEngine = RuleEngine.getInstance();
      
      // Validate the rule structure using the public validate method
      const validationResult = ruleEngine.validate(rule);
      
      // Check if validation failed
      if (validationResult && !validationResult.isValid) {
        const errorMessage = typeof validationResult.error === 'string' 
          ? validationResult.error 
          : validationResult.error?.message || 'Invalid rule structure';
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw new AppError(
        ErrorCode.RULE_VALIDATION_FAILED,
        `Rule validation failed: ${error.message || 'Invalid rule structure'}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Step 2: Extract all field references from the rule
    const fieldNames = this.extractFieldNames(rule);

    // Step 3: Validate that all fields exist in the database
    await this.validateFieldsExist(fieldNames);
  }

  /**
   * Recursively extracts field names from a rule object
   */
  private extractFieldNames(obj: any, fieldNames: Set<string> = new Set()): string[] {
    if (!obj || typeof obj !== 'object') {
      return Array.from(fieldNames);
    }

    // Check if this object has a 'field' property (it's a condition)
    if (obj.field && typeof obj.field === 'string') {
      fieldNames.add(obj.field);
    }

    // Recursively process arrays and objects
    if (Array.isArray(obj)) {
      obj.forEach(item => this.extractFieldNames(item, fieldNames));
    } else {
      Object.values(obj).forEach(value => {
        if (value && typeof value === 'object') {
          this.extractFieldNames(value, fieldNames);
        }
      });
    }

    return Array.from(fieldNames);
  }

  /**
   * Validates that all field names exist in the database
   */
  private async validateFieldsExist(fieldNames: string[]): Promise<void> {
    if (fieldNames.length === 0) {
      return;
    }

    const existingFields = await this.ruleFieldRepository
      .createQueryBuilder('field')
      .where('field.name IN (:...fieldNames)', { fieldNames })
      .getMany();

    const existingFieldNames = new Set(existingFields.map(f => f.name));
    const missingFields = fieldNames.filter(name => !existingFieldNames.has(name));

    if (missingFields.length > 0) {
      throw new AppError(
        ErrorCode.RULE_FIELD_NOT_SUPPORTED,
        `The following fields are not supported: ${missingFields.join(', ')}. ` +
        `Please add them to the available fields before using them in rules.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Gets all available rule fields
   */
  async getAvailableFields(): Promise<RuleFieldEntity[]> {
    return this.ruleFieldRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Adds a new rule field
   */
  async addRuleField(fieldData: Partial<RuleFieldEntity>): Promise<RuleFieldEntity> {
    const existing = await this.ruleFieldRepository.findOne({
      where: { name: fieldData.name },
    });

    if (existing) {
      throw new AppError(
        ErrorCode.RULE_FIELD_ALREADY_EXISTS,
        `Field "${fieldData.name}" already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const field = this.ruleFieldRepository.create(fieldData);
    return this.ruleFieldRepository.save(field);
  }

  /**
   * Removes a rule field
   */
  async removeRuleField(fieldName: string): Promise<{ success: boolean; message: string }> {
    const field = await this.ruleFieldRepository.findOne({
      where: { name: fieldName },
    });

    if (!field) {
      throw new AppError(
        ErrorCode.RULE_FIELD_NOT_FOUND,
        `Field "${fieldName}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.ruleFieldRepository.remove(field);
    return { success: true, message: 'Field removed successfully' };
  }
}
