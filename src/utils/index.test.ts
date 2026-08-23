import { describe, it, expect } from 'vitest';
import { utf8ToBase64, base64ToUtf8, sha256Hex, errorMessage, slugifyId } from './index';

describe('utf8ToBase64 / base64ToUtf8', () => {
  it('roundtrips ASCII text', () => {
    const s = 'Hello, Taazaa!';
    expect(base64ToUtf8(utf8ToBase64(s))).toBe(s);
  });

  it('roundtrips unicode including emoji and CJK', () => {
    const s = 'KRA: 角色 — résumé 🚀 ünïcode';
    expect(base64ToUtf8(utf8ToBase64(s))).toBe(s);
  });

  it('matches atob for plain ASCII', () => {
    expect(utf8ToBase64('abc')).toBe(window.btoa('abc'));
  });
});

describe('sha256Hex', () => {
  it('produces the known digest for "abc"', async () => {
    expect(await sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });
});

describe('errorMessage', () => {
  it('extracts message from Error instances', () => {
    expect(errorMessage(new Error('boom'))).toBe('boom');
  });

  it('stringifies non-Error values', () => {
    expect(errorMessage('plain')).toBe('plain');
    expect(errorMessage(42)).toBe('42');
  });
});

describe('slugifyId', () => {
  it('slugs titles into stable ids', () => {
    expect(slugifyId('Senior AI Engineer!')).toBe('role-senior-ai-engineer');
  });

  it('falls back to untitled for empty input', () => {
    expect(slugifyId('', 'dept')).toBe('dept-untitled');
  });
});
