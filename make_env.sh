#!/bin/bash
set -eu
cat <<EOT > .env
LOCALUID   = `id -u`
LOCALUNAME = `id -u -n`
LOCALGID   = `id -g`
LOCALGNAME = `id -g -n`
EOT