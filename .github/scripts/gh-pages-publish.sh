#!/usr/bin/env bash
#
# Publish a directory to the gh-pages branch, or remove a path from it.
#
#   gh-pages-publish.sh publish <source-dir> <destination>
#   gh-pages-publish.sh remove  <destination>
#
# <destination> is a path relative to the site root, or "." for the root
# itself. Publishing to the root replaces the previous build but leaves
# pr-preview/ alone: that tree belongs to whichever pull requests are open at
# the time, and a production deploy has no business dropping it.
#
# Three things write to this one branch — the production deploy, a preview
# deploy per open PR, and a preview cleanup — so a push can lose a race. The
# loser redoes its own change on top of the winner's rather than forcing past
# it, which is what the retry loop below does. Sharing one concurrency group
# across all three would serialise them instead, but GitHub keeps only a single
# queued run per group and cancels the rest, so under any burst that silently
# drops deploys.
#
# Everything happens in a throwaway clone, so the caller's checkout is left
# alone and nothing here depends on what state it was in.
#
# Environment:
#   GH_TOKEN           token with contents: write (required)
#   GITHUB_REPOSITORY  owner/name (required)
#   COMMIT_MESSAGE     commit subject (required)

set -euo pipefail

ATTEMPTS=5
BRANCH=gh-pages

mode="${1:-}"
case "$mode" in
  publish)
    src="${2:?usage: gh-pages-publish.sh publish <source-dir> <destination>}"
    dest="${3:?usage: gh-pages-publish.sh publish <source-dir> <destination>}"
    src="$(cd "$src" && pwd)"
    ;;
  remove)
    dest="${2:?usage: gh-pages-publish.sh remove <destination>}"
    ;;
  *)
    echo "::error::unknown mode '${mode}'" >&2
    exit 2
    ;;
esac

# A destination is the site root or a path inside it. Anything absolute, or
# anything that climbs out of the branch, is either a bug here or an attempt to
# write somewhere it should not; neither gets to run.
case "$dest" in
  .) ;;
  /* | *..*) echo "::error::refusing destination '${dest}'" >&2; exit 2 ;;
esac

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${COMMIT_MESSAGE:?COMMIT_MESSAGE is required}"

remote="https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# Returns 0 when the work is done (pushed, or there was nothing to do), 1 when
# the push lost a race and the whole thing is worth retrying.
attempt() {
  rm -rf "$work"
  mkdir -p "$work"

  if git ls-remote --exit-code --heads "$remote" "$BRANCH" >/dev/null 2>&1; then
    git clone --quiet --depth 1 --branch "$BRANCH" --single-branch "$remote" "$work"
  elif [ "$mode" = remove ]; then
    echo "No ${BRANCH} branch — nothing to remove."
    return 0
  else
    echo "No ${BRANCH} branch yet — creating it."
    git init --quiet --initial-branch="$BRANCH" "$work"
    git -C "$work" remote add origin "$remote"
  fi

  git -C "$work" config user.name "github-actions[bot]"
  git -C "$work" config user.email "41898282+github-actions[bot]@users.noreply.github.com"

  (
    cd "$work"

    if [ "$mode" = publish ]; then
      if [ "$dest" = "." ]; then
        # Replace the previous build, but keep the preview tree.
        find . -mindepth 1 -maxdepth 1 \
          ! -name .git ! -name pr-preview -exec rm -rf {} +
        cp -a "${src}/." .
      else
        # rm before cp so a build that no longer emits a file stops serving it.
        # Vite's asset names are content-hashed, so without this every push to
        # a PR would leave its predecessor's chunks behind for good.
        rm -rf "$dest"
        mkdir -p "$dest"
        cp -a "${src}/." "${dest}/"
      fi
    else
      if [ ! -e "$dest" ]; then
        echo "'${dest}' is not on ${BRANCH} — nothing to remove."
        exit 3
      fi
      rm -rf "$dest"
    fi

    # Pages runs Jekyll over the branch unless told not to, which eats any file
    # or directory whose name starts with an underscore. Kept at the root
    # because that is the only place Pages looks for it.
    touch .nojekyll
  ) || {
    status=$?
    [ "$status" = 3 ] && return 0
    return "$status"
  }

  git -C "$work" add --all
  if git -C "$work" diff --cached --quiet; then
    echo "${BRANCH} already matches — nothing to push."
    return 0
  fi

  git -C "$work" commit --quiet -m "$COMMIT_MESSAGE"

  if git -C "$work" push --quiet origin "$BRANCH"; then
    echo "Pushed to ${BRANCH} (${mode} ${dest})."
    return 0
  fi
  return 1
}

for i in $(seq 1 "$ATTEMPTS"); do
  if attempt; then
    exit 0
  fi
  echo "${BRANCH} moved underneath us; retrying (${i}/${ATTEMPTS})."
  sleep $(( i * 3 ))
done

echo "::error::could not push to ${BRANCH} after ${ATTEMPTS} attempts" >&2
exit 1
