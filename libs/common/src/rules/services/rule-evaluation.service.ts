import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RuleEvaluationService {
  private readonly logger = new Logger(RuleEvaluationService.name);
  private readonly ruleEnginePromise: Promise<any>;

  constructor() {
    // Same ESM-safe dynamic import used in RuleValidationService
    this.ruleEnginePromise = (0, eval)("import('@usex/rule-engine/dist/esm/index.js')").then(
      (module) => module.RuleEngine,
    );
  }

  /**
   * Evaluates a rule against a context object.
   * Returns true if the context satisfies the rule, false otherwise.
   *
   * When the flattened context contains array values, the rule conditions
   * referencing those fields are "spread" into per-element conditions connected
   * by a logical operator that depends on the rule operator:
   *   - in / exists / equals  → OR  (any element satisfies)
   *   - not in / includes / contains → AND (all elements must satisfy)
   */
  async evaluateRule(rule: any, context: Record<string, any>): Promise<boolean> {
    const RuleEngine = await this.ruleEnginePromise;
    const ruleEngine = RuleEngine.getInstance();

    // The rule-engine resolves fields by flat key lookup after stripping the
    // leading `$` (e.g. `$.device.os` → key `"device.os"`).  We must flatten
    // the nested context to dot-notation keys before evaluation.
    const flatContext = this.flattenContext(context);

    // Detect array values in context and spread both context and rule conditions
    const { transformedContext, transformedRule } = this.spreadArrayFields(flatContext, rule);

    this.logger.debug(
      `[evaluateRule] Evaluating rule. ` +
      `Array fields spread: ${Object.keys(flatContext).filter(k => Array.isArray(flatContext[k])).join(', ') || 'none'}`,
    );
    this.logger.verbose(
      `[evaluateRule] Transformed context keys: ${JSON.stringify(Object.keys(transformedContext))}`,
    );
    this.logger.verbose(
      `[evaluateRule] Transformed rule: ${JSON.stringify(transformedRule)}`,
    );

    const result = await ruleEngine.evaluate(transformedRule, transformedContext);

    this.logger.debug(`[evaluateRule] Evaluation result: ${JSON.stringify(result)}`);

    // Handle both boolean and object return shapes
    if (typeof result === 'boolean') {
      return result;
    }
    return result?.isPassed ?? result?.result ?? result?.passed ?? false;
  }

  /**
   * Determines the logical connector for spread conditions based on the operator.
   *
   * OR operators (any element must satisfy):
   *   - "in": any context element found in the rule value array → match
   *   - "exists": any element exists → match
   *   - "equals": any element equals the value → match
   *
   * AND operators (all elements must satisfy):
   *   - "not in": no context element is in the rule value array → all must pass
   *   - "includes" / "contains": all context elements must be in the rule value
   */
  private getSpreadConnector(operator: string): 'or' | 'and' {
    const orOperators = ['in', 'exists', 'equals', 'equal', '==', '===', 'contains', 'contain'];
    if (orOperators.includes(operator.toLowerCase().trim())) {
      return 'or';
    }
    // Default to 'and' for: not in, not contains, includes, not equals, etc.
    return 'and';
  }

  /**
   * Detects array-valued fields in the flat context and:
   * 1. Spreads each array into indexed fields (field_1, field_2, …)
   * 2. Transforms rule conditions that reference those fields into grouped
   *    sub-conditions (one per array element) connected by the appropriate
   *    logical operator.
   *
   * String values that look like comma-separated lists are first converted
   * to arrays (e.g. "agent,agent_linux" → ["agent", "agent_linux"]).
   */
  private spreadArrayFields(
    flatContext: Record<string, any>,
    rule: any,
  ): { transformedContext: Record<string, any>; transformedRule: any } {
    // First pass: convert comma-separated string values to arrays for known
    // multi-value fields (like device.type, type, etc.)
    const normalizedContext = this.normalizeArrayFields(flatContext);

    // Identify which context keys hold array values
    const arrayFields: Record<string, any[]> = {};
    for (const [key, value] of Object.entries(normalizedContext)) {
      if (Array.isArray(value) && value.length > 0) {
        arrayFields[key] = value;
      }
    }

    if (Object.keys(arrayFields).length === 0) {
      // No arrays — nothing to transform
      return { transformedContext: normalizedContext, transformedRule: rule };
    }

    this.logger.debug(
      `[spreadArrayFields] Detected array fields: ${JSON.stringify(
        Object.entries(arrayFields).map(([k, v]) => ({ field: k, values: v })),
      )}`,
    );

    // Build transformed context: replace array fields with indexed fields
    const transformedContext: Record<string, any> = {};
    for (const [key, value] of Object.entries(normalizedContext)) {
      if (arrayFields[key]) {
        const arr = arrayFields[key];
        for (let i = 0; i < arr.length; i++) {
          transformedContext[`${key}_${i + 1}`] = arr[i];
        }
        this.logger.debug(
          `[spreadArrayFields] Spread "${key}" (${arr.length} items) → ` +
          arr.map((_, i) => `${key}_${i + 1}`).join(', '),
        );
      } else {
        transformedContext[key] = value;
      }
    }

    // Deep-clone the rule and transform conditions
    const transformedRule = JSON.parse(JSON.stringify(rule));
    if (transformedRule.conditions && Array.isArray(transformedRule.conditions)) {
      for (let i = 0; i < transformedRule.conditions.length; i++) {
        transformedRule.conditions[i] = this.transformConditionGroup(
          transformedRule.conditions[i],
          arrayFields,
        );
      }
    }

    return { transformedContext, transformedRule };
  }

  /**
   * Transforms a condition group (an object with "and" or "or" keys) by
   * spreading any conditions that reference array fields.
   */
  private transformConditionGroup(
    group: any,
    arrayFields: Record<string, any[]>,
  ): any {
    if (!group || typeof group !== 'object') return group;

    const result: any = {};
    for (const connector of ['and', 'or']) {
      if (Array.isArray(group[connector])) {
        result[connector] = [];
        for (const condition of group[connector]) {
          // If this is a nested group (has 'and' or 'or'), recurse
          if (condition.and || condition.or) {
            result[connector].push(
              this.transformConditionGroup(condition, arrayFields),
            );
            continue;
          }

          // Check if this condition references an array field
          const field = this.normalizeFieldName(condition.field);
          if (arrayFields[field]) {
            const spreadConditions = this.spreadCondition(
              condition,
              field,
              arrayFields[field],
            );
            result[connector].push(spreadConditions);
            this.logger.debug(
              `[transformConditionGroup] Spread condition for field "${field}" ` +
              `with operator "${condition.operator}" → connector: "${Object.keys(spreadConditions)[0]}", ` +
              `${arrayFields[field].length} sub-conditions`,
            );
          } else {
            result[connector].push(condition);
          }
        }
      }
    }

    // Preserve any other keys in the group that aren't 'and'/'or'
    for (const key of Object.keys(group)) {
      if (key !== 'and' && key !== 'or') {
        result[key] = group[key];
      }
    }

    return result;
  }

  /**
   * Spreads a single condition into multiple indexed conditions wrapped
   * in an appropriate logical group.
   *
   * When the original operator is "Contains" or "Not Contains" and the context
   * field is an array, the operator is converted to "in" / "not in" because
   * after spreading each indexed field holds a scalar value (not an array).
   * The rule-engine's "Contains" expects an array field, so we must adapt.
   */
  private spreadCondition(
    condition: any,
    fieldKey: string,
    arrayValues: any[],
  ): any {
    // Convert Contains/Not Contains → in/not in for spread scalar fields
    const { operator: resolvedOperator, value: resolvedValue } =
      this.adaptOperatorForSpread(condition.operator, condition.value);

    const connector = this.getSpreadConnector(resolvedOperator);
    const subConditions: any[] = [];

    for (let i = 0; i < arrayValues.length; i++) {
      const indexedField = condition.field.replace(
        this.getFieldPathFromCondition(condition.field),
        `${this.getFieldPathFromCondition(condition.field)}_${i + 1}`,
      );
      subConditions.push({
        ...condition,
        field: indexedField,
        operator: resolvedOperator,
        value: resolvedValue,
      });
    }

    if (resolvedOperator !== condition.operator) {
      this.logger.debug(
        `[spreadCondition] Converted operator "${condition.operator}" → "${resolvedOperator}" ` +
        `for array field "${fieldKey}" (value: ${JSON.stringify(resolvedValue)})`,
      );
    }

    return { [connector]: subConditions };
  }

  /**
   * Adapts "Contains" / "Not Contains" operators to "in" / "not in" when the
   * context field is an array being spread into scalar indexed fields.
   *
   * "Contains" on an array means "does the array include this value?" which,
   * after spreading, becomes "is any element in [value]?" → operator "in".
   *
   * "Not Contains" becomes "not in" (all elements must not be the value).
   *
   * The value is wrapped in an array if it isn't one already, since "in"/"not in"
   * expect an array of allowed/disallowed values.
   */
  private adaptOperatorForSpread(
    operator: string,
    value: any,
  ): { operator: string; value: any } {
    const op = operator.toLowerCase().trim();
    if (op === 'contains' || op === 'contain') {
      const arrValue = Array.isArray(value) ? value : [value];
      this.logger.debug(
        `[adaptOperatorForSpread] "${operator}" → "in", value wrapped: ${JSON.stringify(arrValue)}`,
      );
      return { operator: 'in', value: arrValue };
    }
    if (op === 'not contains' || op === 'not contain' || op === 'notcontains') {
      const arrValue = Array.isArray(value) ? value : [value];
      this.logger.debug(
        `[adaptOperatorForSpread] "${operator}" → "not in", value wrapped: ${JSON.stringify(arrValue)}`,
      );
      return { operator: 'not in', value: arrValue };
    }
    return { operator, value };
  }

  /**
   * Strips the leading "$." prefix from a field name for context lookup.
   */
  private normalizeFieldName(field: string): string {
    if (field.startsWith('$.')) {
      return field.slice(2);
    }
    return field;
  }

  /**
   * Returns the field path portion (with or without "$." prefix preserved).
   */
  private getFieldPathFromCondition(field: string): string {
    if (field.startsWith('$.')) {
      return field.slice(2);
    }
    return field;
  }

  /**
   * Normalizes context values that should be arrays but arrive as
   * comma-separated strings. This handles the common case where device types
   * are stored in the DB as "agent,agent_linux" but should be treated as
   * ["agent", "agent_linux"].
   *
   * Heuristic: if a string value contains commas, it's split into an array.
   * Only applied to fields whose values are strings containing commas.
   */
  private normalizeArrayFields(
    flatContext: Record<string, any>,
  ): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(flatContext)) {
      if (typeof value === 'string' && value.includes(',')) {
        const parts = value.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
        if (parts.length > 1) {
          this.logger.debug(
            `[normalizeArrayFields] Converted comma-separated string to array: "${key}" = "${value}" → [${parts.join(', ')}]`,
          );
          result[key] = parts;
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Recursively flattens a nested object to dot-notation keys.
   * Arrays are kept as-is (not recursed into) so array operators still work.
   *
   * Example:
   *   { device: { os: 'macos', any: true } }
   *   → { 'device.os': 'macos', 'device.any': true }
   */
  private flattenContext(
    obj: Record<string, any>,
    prefix = '',
    result: Record<string, any> = {},
  ): Record<string, any> {
    for (const key of Object.keys(obj)) {
      const flatKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (
        value !== null &&
        value !== undefined &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        this.flattenContext(value, flatKey, result);
      } else {
        result[flatKey] = value;
      }
    }
    return result;
  }
}
