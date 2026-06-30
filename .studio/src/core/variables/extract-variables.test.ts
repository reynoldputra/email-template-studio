import { describe, expect, it } from 'vitest';
import { interpolateVariables } from '../render/interpolate-variables.js';
import { extractVariables } from './extract-variables.js';

describe('extractVariables', () => {
  it('extracts unique placeholders with inferred metadata', () => {
    const source = '<mj-text>Hello {{ user.first_name }} and {{ user.first_name }} from {{ account_name }}</mj-text>';
    expect(extractVariables(source)).toEqual([
      {
        expression: 'user.first_name',
        key: 'user_first_name',
        label: 'First Name',
        defaultValue: 'Ava',
        inputType: 'text'
      },
      {
        expression: 'account_name',
        key: 'account_name',
        label: 'Account Name',
        defaultValue: 'Ava',
        inputType: 'text'
      }
    ]);
  });

  it('infers url and email input types', () => {
    const tokens = extractVariables('{{ confirmation_url }} {{ contact_email }}');
    expect(tokens[0]).toMatchObject({ inputType: 'url', defaultValue: 'https://example.com/confirmation' });
    expect(tokens[1]).toMatchObject({ inputType: 'email', defaultValue: 'ava@example.com' });
  });

  it('interpolates values keyed by expression and xml-escapes them', () => {
    expect(interpolateVariables('Hello {{ user.first_name }}', { 'user.first_name': 'Rae' })).toBe('Hello Rae');
    expect(interpolateVariables('<x>{{ name }}</x>', { name: '<b>Hi</b>' })).toBe('<x>&lt;b&gt;Hi&lt;/b&gt;</x>');
  });
});
