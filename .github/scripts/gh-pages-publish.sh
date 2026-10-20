#!/usr/bin/env bash
#
# Publish a built site to the root of the gh-pages branch.
#
#   gh-pages-publish.sh <source-dir>
#
# The branch ends up holding exactly the build and nothing else: whatever the
# previous deploy left that this one does not emit stops being served. Vite's
# asset names are content-hashed, so without that every deploy would leave its
# predecessor's chunks behind for good.
#
# Only the production deploy writes to this branch, and its concurrency group
# runs one deploy at a time, so a push has nothing to race.
#
# Everything happens in a throwaway clone, so the caller's checkout is left
# alone and nothing here depends on what state it was in.
#
# Environment:
#   GH_TOKEN           token with contents: write (required)
#   GITHUB_REPOSITORY  owner/name (required)
#   COMMIT_MESSAGE     commit subject (required)

set -euo pipefail

BRANCH=gh-pages

src="${1:?usage: gh-pages-publish.sh <source-dir>}"
src="$(cd "$src" && pwd)"

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${COMMIT_MESSAGE:?COMMIT_MESSAGE is required}"

remote="https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

if git ls-remote --exit-code --heads "$remote" "$BRANCH" >/dev/null 2>&1; then
  git clone --quiet --depth 1 --branch "$BRANCH" --single-branch "$remote" "$work"
else
  echo "No ${BRANCH} branch yet — creating it."
  git init --quiet --initial-branch="$BRANCH" "$work"
  git -C "$work" remote add origin "$remote"
fi

git -C "$work" config user.name "github-actions[bot]"
git -C "$work" config user.email "41898282+github-actions[bot]@users.noreply.github.com"

find "$work" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a "${src}/." "$work/"
# Pages runs Jekyll over the branch unless told not to, which eats any file or
# directory whose name starts with an underscore.
touch "$work/.nojekyll"

git -C "$work" add --all
if git -C "$work" diff --cached --quiet; then
  echo "${BRANCH} already matches — nothing to push."
  exit 0
fi

git -C "$work" commit --quiet -m "$COMMIT_MESSAGE"
git -C "$work" push --quiet origin "$BRANCH"
echo "Pushed to ${BRANCH}."
