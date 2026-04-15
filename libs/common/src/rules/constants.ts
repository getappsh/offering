/**
 * Default rule constants
 */

/**
 * Name of the default policy that allows all devices to download a component.
 * This rule is automatically applied to all existing and new releases unless manually removed.
 */
export const DEFAULT_ALLOW_ALL_DEVICES_RULE_NAME = 'Allow All Devices';

/**
 * UUID for the default "Allow All Devices" policy rule
 */
export const DEFAULT_ALLOW_ALL_DEVICES_RULE_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Rule definition for the default "Allow All Devices" policy.
 * Using an OR condition so that both the prefixed ($.device.any) and
 * un-prefixed (device.any) field variants evaluate correctly.
 */
export const DEFAULT_ALLOW_ALL_DEVICES_RULE = {
    conditions: [{
        or: [
            { field: '$.device.any', value: true, operator: 'equals' },
            { field: 'device.any',   value: true, operator: 'equals' },
        ],
    }],
};
