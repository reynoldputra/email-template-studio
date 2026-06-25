import { describe, expect, it } from 'vitest';
import { interpolateVariables } from '../render/interpolate-variables.js';
import { extractVariables } from './extract-variables.js';

describe('extractVariables', () => {
  it('extracts unique placeholders and derives labels', () => {
    const source = '<mj-text>Hello {{ user.first_name }} and {{ user.first_name }} from {{ account_name }}</mj-text>';
    expect(extractVariables(source)).toEqual([
      {
        expression: 'user.first_name',
        key: 'user_first_name',
        label: 'User First Name',
        defaultValue: 'Sample User First Name'
      },
      {
        expression: 'account_name',
        key: 'account_name',
        label: 'Account Name',
        defaultValue: 'Sample Account Name'
      }
    ]);
  });

  it('interpolates provided values by expression', () => {
    expect(interpolateVariables('Hello {{ user.first_name }}', { user_first_name: 'Rae' })).toBe('Hello Rae');
  });
});
