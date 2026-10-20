/**
 * The Cloudflare Pages API calls the PR preview workflows make.
 *
 * Every upload Cloudflare receives stays reachable at its own permanent
 * <hash>.<project>.pages.dev address, not just at the pr-<n> alias that points
 * at the newest one. Removing a preview therefore means deleting each of its
 * deployments; dropping the alias alone would leave every earlier build of the
 * pull request online for good.
 *
 * Runs inside actions/github-script, which provides a global fetch.
 */
const API = 'https://api.cloudflare.com/client/v4';
const PER_PAGE = 25;
// A runaway guard, not a limit anyone should reach: 5,000 deployments.
const MAX_PAGES = 200;
const ATTEMPTS = 3;

/**
 * @param {{accountId: string, apiToken: string, project: string}} options
 */
function client({ accountId, apiToken, project }) {
  if (!accountId || !apiToken || !project) {
    throw new Error('A Cloudflare account ID, API token and Pages project name are all required');
  }
  const base = `${API}/accounts/${encodeURIComponent(accountId)}/pages/projects/${encodeURIComponent(project)}`;

  const call = async (method, path, query = {}) => {
    const url = new URL(base + path);
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));

    for (let attempt = 1; ; attempt++) {
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${apiToken}` } });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.success !== false) return body;

      // Rate limits and Cloudflare's own hiccups are worth another go; a
      // rejected request is not.
      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt < ATTEMPTS) {
        const wait = Number(res.headers.get('retry-after')) || attempt * 5;
        await new Promise((resolve) => setTimeout(resolve, wait * 1000));
        continue;
      }
      const detail = (body.errors || []).map((e) => `${e.code}: ${e.message}`).join('; ');
      throw new Error(
        `Cloudflare ${method} ${path || '/'} failed with HTTP ${res.status}${detail ? ` (${detail})` : ''}`,
      );
    }
  };

  return {
    /** The project itself; `subdomain` is the <project>.pages.dev host it serves. */
    async project() {
      return (await call('GET', '')).result;
    },

    /** Every preview deployment in the project, in no particular order. */
    async previewDeployments() {
      const all = [];
      for (let page = 1; page <= MAX_PAGES; page++) {
        const { result } = await call('GET', '/deployments', { env: 'preview', page, per_page: PER_PAGE });
        all.push(...result);
        if (result.length < PER_PAGE) return all;
      }
      throw new Error(`More than ${MAX_PAGES * PER_PAGE} preview deployments; refusing to page further`);
    },

    /** force: a deployment an alias still points at is refused without it. */
    async remove(deployment) {
      await call('DELETE', `/deployments/${encodeURIComponent(deployment.id)}`, { force: true });
    },
  };
}

const branchOf = (deployment) => deployment.deployment_trigger?.metadata?.branch ?? '';
const commitOf = (deployment) => deployment.deployment_trigger?.metadata?.commit_hash ?? '';
const newestFirst = (a, b) => new Date(b.created_on) - new Date(a.created_on);

/**
 * Delete a branch's deployments, newest `keep` excepted.
 * @returns {Promise<{kept: object[], removed: number}>}
 */
async function prune(cf, branch, { keep = 0 } = {}) {
  const deployments = (await cf.previewDeployments())
    .filter((deployment) => branchOf(deployment) === branch)
    .sort(newestFirst);
  const stale = deployments.slice(keep);
  for (const deployment of stale) await cf.remove(deployment);
  return { kept: deployments.slice(0, keep), removed: stale.length };
}

module.exports = { client, branchOf, commitOf, newestFirst, prune };
