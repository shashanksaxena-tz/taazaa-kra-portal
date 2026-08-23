import { GitHubConfig, PortalData } from '../types';
import { utf8ToBase64 } from '../utils';
import { errorMessage } from '../utils';

export interface CommitResult {
  success: boolean;
  message: string;
  commitUrl?: string;
  sha?: string;
}

export const githubService = {
  async verifyRepoAccess(config: GitHubConfig): Promise<{ valid: boolean; message: string }> {
    if (!config.token || !config.owner || !config.repo) {
      return { valid: false, message: 'Please enter Repository Owner, Repo Name, and GitHub Token.' };
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (res.status === 401) {
        return { valid: false, message: 'Invalid GitHub Personal Access Token.' };
      }
      if (res.status === 404) {
        return { valid: false, message: `Repository "${config.owner}/${config.repo}" not found or token lacks access.` };
      }
      if (!res.ok) {
        return { valid: false, message: `GitHub API error: ${res.statusText}` };
      }

      const repoData = await res.json();
      if (repoData.permissions && !repoData.permissions.push) {
        return { valid: false, message: 'Token does not have write (push) permissions to this repository.' };
      }

      return { valid: true, message: `Connected to ${repoData.full_name} (${repoData.default_branch})` };
    } catch (err: unknown) {
      return { valid: false, message: `Network error connecting to GitHub: ${errorMessage(err)}` };
    }
  },

  async commitChanges(
    config: GitHubConfig,
    data: PortalData,
    customCommitMessage?: string
  ): Promise<CommitResult> {
    if (!config.token || !config.owner || !config.repo) {
      return {
        success: false,
        message: 'Missing GitHub configuration. Please configure GitHub credentials in Settings.',
      };
    }

    try {
      const path = config.filePath || 'src/data/kras.json';
      const branch = config.branch || 'main';
      const fileUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${branch}`;

      // 1. Fetch current file SHA if it exists
      let currentSha: string | undefined = undefined;
      const getRes = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (getRes.ok) {
        const fileInfo = await getRes.json();
        currentSha = fileInfo.sha;
      }

      // 2. Prepare payload
      const jsonContent = JSON.stringify(data, null, 2);
      const base64Content = utf8ToBase64(jsonContent);

      const commitMessage = customCommitMessage || 
        `chore(kras): update role charters and metrics via Admin Portal (${new Date().toLocaleString()})`;

      const bodyPayload: {
        message: string;
        content: string;
        branch: string;
        sha?: string;
      } = {
        message: commitMessage,
        content: base64Content,
        branch: branch,
      };

      if (currentSha) {
        bodyPayload.sha = currentSha;
      }

      // 3. Put request to create/update file
      const putRes = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        return {
          success: false,
          message: errJson.message || `Failed to commit changes (${putRes.status} ${putRes.statusText})`,
        };
      }

      const putData = await putRes.json();
      return {
        success: true,
        message: 'Changes successfully committed and pushed to GitHub! GitHub Pages will auto-deploy shortly.',
        commitUrl: putData.commit?.html_url,
        sha: putData.commit?.sha,
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: `Network failure while committing to GitHub: ${errorMessage(err)}`,
      };
    }
  },
};
