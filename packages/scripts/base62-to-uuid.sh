#!/bin/bash
set -e

UUID=$1

node -e "console.log(require('uuid-base62').decode('${UUID}'))"
