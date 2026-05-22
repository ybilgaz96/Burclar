#!/bin/sh
set -e

apk add --no-cache git
npm install
node scripts/generate.js
node scripts/build-pages.js

git config --global user.email "ci@github.com"
git config --global user.name "GitHub Actions"
git add -A
git diff --staged --quiet || git commit -m "ci: auto-generate horoscope pages"
git push origin HEAD:main