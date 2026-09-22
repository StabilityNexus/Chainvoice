#!/usr/bin/env bash
#
# Work out where this repository's GitHub Pages site actually lives, and write
# the answer to $GITHUB_OUTPUT.
#
# Asked of the API rather than hardcoded, because the answer differs between
# this repository and every fork of it, and getting it wrong publishes a site
# whose every asset 404s. A fork with no custom domain serves from
# https://<owner>.github.io/<repo>/, so its base path is /<repo>/; a repository
# with a custom domain serves that domain's root, so its base path is /. The
# github.io URL of a repository with a custom domain redirects to the domain
# and drops the /<repo>/ segment on the way, which is exactly how a site built
# for the wrong base ends up blank.
#
# There is deliberately no guess of last resort. Getting this wrong does real
# damage — a production deploy would publish unreachable assets and, with no
# CNAME written, hand back the custom domain — and a wrong answer here is
# invisible until someone opens the site. Set PAGES_SITE_URL to override if the
# API is ever unreachable.
#
# Outputs:
#   site_url   absolute URL of the site root, with a trailing slash
#   base_path  path part of site_url, with leading and trailing slashes
#   cname      custom domain, or empty when the site is on github.io
#
# Environment:
#   GH_TOKEN         token with `pages: read` (required unless PAGES_SITE_URL)
#   PAGES_SITE_URL   override, e.g. https://chainvoice.stability.nexus/

set -euo pipefail

site_url="${PAGES_SITE_URL:-}"
cname=""

if [ -n "$site_url" ]; then
  echo "Using PAGES_SITE_URL."
else
  : "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
  # --jq is gh's own filter, so this needs nothing on the runner but gh.
  if ! pages="$(gh api "repos/${GITHUB_REPOSITORY}/pages" \
      --jq '[.html_url // "", .cname // ""] | @tsv' 2>&1)"; then
    echo "::error::could not read the Pages configuration of ${GITHUB_REPOSITORY}."
    echo "::error::Enable GitHub Pages on this repository, or set the PAGES_SITE_URL variable."
    echo "$pages" >&2
    exit 1
  fi
  IFS=$'\t' read -r site_url cname <<< "$pages"
fi

if [ -z "$site_url" ]; then
  echo "::error::Pages reported no URL for this repository."
  exit 1
fi

case "$site_url" in
  https://* | http://*) ;;
  *) echo "::error::'${site_url}' is not an absolute URL"; exit 1 ;;
esac

case "$site_url" in
  */) ;;
  *) site_url="${site_url}/" ;;
esac

host="$(printf '%s' "$site_url" | sed -E 's#^[a-zA-Z][a-zA-Z0-9+.-]*://([^/]+).*#\1#')"

# With an override there is no API answer to take the domain from, so derive it:
# anything that is not a github.io address is a custom domain, and a custom
# domain needs its CNAME file written.
if [ -z "$cname" ] && [ -n "${PAGES_SITE_URL:-}" ]; then
  case "$host" in
    *.github.io) ;;
    *) cname="$host" ;;
  esac
fi

base_path="/$(printf '%s' "$site_url" | sed -E 's#^[a-zA-Z][a-zA-Z0-9+.-]*://[^/]+/?##')"
case "$base_path" in
  */) ;;
  *) base_path="${base_path}/" ;;
esac

{
  echo "site_url=${site_url}"
  echo "base_path=${base_path}"
  echo "cname=${cname}"
} >> "${GITHUB_OUTPUT:-/dev/stdout}"

echo "site_url=${site_url}"
echo "base_path=${base_path}"
echo "cname=${cname:-<none, github.io>}"
