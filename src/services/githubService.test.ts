import { describe, it, expect, beforeEach, vi } from 'vitest';
import { githubService } from './githubService';
import type { GitHubConfig } from '../types';

const config: GitHubConfig = {
  owner: 'acme',
  repo: 'portal',
  branch: 'main',
  filePath: 'src/data/kras.json',
  token: 'ghp_test',
};

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('verifyRepoAccess', () => {
  it('rejects incomplete config without calling the API', async () => {
    const result = await githubService.verifyRepoAccess({ ...config, token: '' });
    expect(result.valid).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts a repo where the token has push permission', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ full_name: 'acme/portal', default_branch: 'main', permissions: { push: true } }),
    });
    const result = await githubService.verifyRepoAccess(config);
    expect(result.valid).toBe(true);
    expect(result.message).toContain('acme/portal');
  });

  it('maps 401 to an invalid-token message', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized', json: async () => ({}) });
    const result = await githubService.verifyRepoAccess(config);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/Invalid/i);
  });

  it('maps 404 to a not-found message', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) });
    const result = await githubService.verifyRepoAccess(config);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/not found/i);
  });

  it('reports tokens that can read but not push', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ full_name: 'acme/portal', default_branch: 'main', permissions: { push: false } }),
    });
    const result = await githubService.verifyRepoAccess(config);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/push/i);
  });
});

describe('commitChanges', () => {
  const portalData = { departments: [], raciMatrix: [] } as never;

  it('rejects missing credentials before any network call', async () => {
    const result = await githubService.commitChanges({ ...config, owner: '' }, portalData);
    expect(result.success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches current sha and includes it in the PUT payload', async () => {
    let putBody: Record<string, unknown> = {};
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ sha: 'abc123' }),
      })
      .mockImplementationOnce(async (_url: string, init?: RequestInit) => {
        putBody = JSON.parse(init!.body as string);
        return {
          ok: true,
          status: 200,
          json: async () => ({ commit: { html_url: 'https://github.com/x/1', sha: 'def456' } }),
        };
      });

    const result = await githubService.commitChanges(config, portalData, 'test commit');
    expect(result.success).toBe(true);
    expect(result.sha).toBe('def456');
    expect(putBody.sha).toBe('abc123');
    expect(putBody.message).toBe('test commit');
    expect(putBody.branch).toBe('main');
    expect(atob(putBody.content as string)).toContain('"departments": []');
  });

  it('returns an error result when the PUT fails', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ sha: 'abc123' }) })
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: async () => ({ message: 'does not match' }),
      });

    const result = await githubService.commitChanges(config, portalData);
    expect(result.success).toBe(false);
    expect(result.message).toContain('does not match');
  });

  it('uses the configured filePath in both requests', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ commit: { html_url: '', sha: '' } }),
      });

    await githubService.commitChanges(config, portalData);
    const getUrl = fetchMock.mock.calls[0][0] as string;
    const putUrl = fetchMock.mock.calls[1][0] as string;
    expect(getUrl).toContain('src/data/kras.json');
    expect(getUrl).toContain('ref=main');
    expect(putUrl).toContain('src/data/kras.json');
  });
});
