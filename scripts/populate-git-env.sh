# From: https://github.com/UnlyEd/next-right-now/blob/e4e2e7aa33b670e60cc451c138db47d51d2e840d/scripts/populate-git-env.sh

export "GIT_COMMIT_SHA=$(yarn --silent git:getCommitSHA)"
export "GIT_COMMIT_SHA_SHORT=$(yarn --silent git:getCommitSHA:short)"
export "GIT_COMMIT_REF=$(yarn --silent git:getCommitRef)"
export "GIT_COMMIT_TAGS=$(yarn --silent git:getReleasesAndTags)"
export "DATESTAMP=$(date +%Y%m%d)"
