#!/bin/bash
set -ex

now --token ${NOW_TOKEN} rm -y ooni-explorer || echo "nothing deleted"
NOW_URL=$(now --token ${NOW_TOKEN} ./ -n ooni-explorer --public --npm)
echo "Preview available at: $NOW_URL"
