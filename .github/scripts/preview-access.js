/**
 * Who a PR preview trusts, and how a maintainer's approval is recorded.
 *
 * Pull requests from people who can push to this repository get a preview
 * straight away. Anyone else's waits for a maintainer to review the code and
 * add the `preview` label — otherwise anyone could open a pull request and have
 * a page of their choosing, such as a fake wallet prompt, hosted on the preview
 * domain.
 *
 * The approval itself is a commit status on the exact commit the maintainer
 * labelled. A fork cannot create statuses in this repository, so it cannot
 * forge one, and every later push lands on a commit that has none.
 */
const LABEL = 'preview';
const STATUS_CONTEXT = 'pr-preview/approved';
const BOT = 'github-actions[bot]';

/**
 * Whether `login` can push to this repository. `permission` folds maintain
 * into write and triage into read, so triage — which can add labels — does not
 * count.
 */
async function hasWriteAccess({ github, context }, login) {
  try {
    const { data } = await github.rest.repos.getCollaboratorPermissionLevel({
      ...context.repo,
      username: login,
    });
    return data.permission === 'admin' || data.permission === 'write';
  } catch (error) {
    // Not a collaborator at all, which includes bots.
    if (error.status === 404) return false;
    throw error;
  }
}

/** The approval recorded on `sha`, or undefined. */
async function findApproval({ github, context }, sha) {
  const statuses = await github.paginate(github.rest.repos.listCommitStatusesForRef, {
    ...context.repo,
    ref: sha,
    per_page: 100,
  });
  return statuses.find(
    (status) =>
      status.context === STATUS_CONTEXT && status.state === 'success' && status.creator?.login === BOT,
  );
}

module.exports = { LABEL, STATUS_CONTEXT, hasWriteAccess, findApproval };
