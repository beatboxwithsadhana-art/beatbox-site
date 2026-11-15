#!/usr/bin/env sh
# Build the static site and publish dist/client to the gh-pages branch (GitHub Pages serves that branch).
set -e
cd "$(dirname "$0")"
npm run build
cp dist/client/index.html dist/client/404.html
touch dist/client/.nojekyll
echo "beatbox.sadhanatawde.com" > dist/client/CNAME
REMOTE=$(git remote get-url origin)
cd dist/client
rm -rf .git && git init -q -b gh-pages && git add -A
git commit -qm "Deploy $(date +%F)"
git push -f "$REMOTE" gh-pages
rm -rf .git
