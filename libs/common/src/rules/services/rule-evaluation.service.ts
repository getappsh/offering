import { Injectable } from '@nestjs/common';

@Injectable()
export class RuleEvaluationService {
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
   */
  async evaluateRule(rule: any, context: Record<string, any>): Promise<boolean> {
    const RuleEngine = await this.ruleEnginePromise;
    const ruleEngine = RuleEngine.getInstance();

    // The rule-engine resolves fields by flat key lookup after stripping the
    // leading `$` (e.g. `$.device.os` → key `"device.os"`).  We must flatten
    // the nested context to dot-notation keys before evaluation.
    const flatContext = this.flattenContext(context);

    const result = await ruleEngine.evaluate(rule, flatContext);

    // Handle both boolean and object return shapes
    if (typeof result === 'boolean') {
      return result;
    }
    return result?.isPassed ?? result?.result ?? result?.passed ?? false;
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
