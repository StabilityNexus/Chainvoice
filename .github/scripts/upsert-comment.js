/**
 * Post a preview comment on a pull request, or edit the one already there.
 *
 * One comment per pull request, edited in place, so a branch with thirty
 * pushes does not leave thirty near-identical bot comments behind.
 *
 * @param {{github: object, context: object, core: object}} ctx
 *   the objects actions/github-script puts in scope
 * @param {number} prNumber
 * @param {string} body - comment body, without the marker
 * @param {{onlyIfPresent?: boolean}} [options]
 *   onlyIfPresent: edit an existing comment but do not create one. Used when
 *   removing a preview — a pull request that never had a preview should not
 *   acquire a comment saying its preview is gone.
 */
module.exports = async ({ github, context, core }, prNumber, body, options = {}) => {
  const MARKER = '<!-- chainvoice-pr-preview -->';
  const { owner, repo } = context.repo;

  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  // Has to be our own comment. Matching the marker anywhere in anyone's
  // comment would let a pull request author plant it and have their own text
  // overwritten — or, since editing someone else's comment fails, have this
  // step break on every run.
  const existing = comments.find(
    (comment) =>
      comment.user?.login === 'github-actions[bot]' && comment.body?.startsWith(MARKER),
  );

  const withMarker = `${MARKER}\n${body}`;

  if (existing) {
    await github.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body: withMarker,
    });
    core.info(`Updated preview comment on #${prNumber}.`);
    return;
  }

  if (options.onlyIfPresent) {
    core.info(`No preview comment on #${prNumber}; leaving it alone.`);
    return;
  }

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: withMarker,
  });
  core.info(`Posted preview comment on #${prNumber}.`);
};
