#!/bin/bash

# This script runs on vercel when configured in the dashboard under
# Settings > Git > Ignored Build Step
# Refer: https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel

if [[ "$VERCEL_GIT_COMMIT_REF" = dependabot/* ]] ; then
  echo "Skipping deploy!"
  exit 0;
else
  exit 1;
fi