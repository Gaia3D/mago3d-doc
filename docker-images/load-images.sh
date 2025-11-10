#!/bin/bash

# Docker Images Loading Script
# This script loads all .tar files in the current directory into Docker

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Docker Images Loading Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Find all .tar files in the directory (excluding temp files)
TAR_FILES=($(find "$SCRIPT_DIR" -maxdepth 1 -name "*.tar" -type f ! -name ".*" | sort))

if [ ${#TAR_FILES[@]} -eq 0 ]; then
    echo -e "${RED}Error: No .tar files found in $SCRIPT_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}Found ${#TAR_FILES[@]} Docker image(s) to load${NC}"
echo ""

# Counter for tracking progress
LOADED=0
FAILED=0
TOTAL=${#TAR_FILES[@]}

# Load each tar file
for TAR_FILE in "${TAR_FILES[@]}"; do
    FILENAME=$(basename "$TAR_FILE")
    echo -e "${YELLOW}[$(($LOADED + $FAILED + 1))/$TOTAL]${NC} Loading: ${BLUE}$FILENAME${NC}"

    if docker load -i "$TAR_FILE"; then
        echo -e "${GREEN}✓ Successfully loaded: $FILENAME${NC}"
        LOADED=$((LOADED + 1))
    else
        echo -e "${RED}✗ Failed to load: $FILENAME${NC}"
        FAILED=$((FAILED + 1))
    fi
    echo ""
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total images: $TOTAL"
echo -e "${GREEN}Successfully loaded: $LOADED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
fi
echo ""

# List loaded images
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Loaded Docker Images${NC}"
echo -e "${BLUE}========================================${NC}"
docker images | grep -E "mago3d|REPOSITORY" || docker images

exit 0
