#!/bin/bash

# Simplified Vercel Deployment Script
# Since frontend and backend are in the same monorepo

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Vercel Deployment...${NC}\n"

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
    # Try to load from .env.local
    if [ -f .env.local ]; then
        export $(grep VERCEL_TOKEN .env.local | xargs)
    fi
    
    if [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${RED}❌ Error: VERCEL_TOKEN not found${NC}"
        echo "Please set VERCEL_TOKEN in .env.local or as environment variable"
        exit 1
    fi
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${BLUE}📦 Installing Vercel CLI...${NC}"
    npm i -g vercel
fi

# Deployment type: production or preview
DEPLOY_TYPE="${1:-prod}"

if [ "$DEPLOY_TYPE" = "prod" ]; then
    VERCEL_FLAGS="--prod"
    echo -e "${GREEN}📦 Deploying to PRODUCTION${NC}\n"
else
    VERCEL_FLAGS=""
    echo -e "${BLUE}📦 Deploying to PREVIEW${NC}\n"
fi

# Deploy Project
echo -e "${BLUE}🌐 Deploying Project...${NC}"
vercel $VERCEL_FLAGS --token $VERCEL_TOKEN --yes

echo -e "${GREEN}✅ Deployment successful!${NC}\n"
echo -e "${GREEN}🎉 Your app is live!${NC}"
echo -e "${BLUE}Check your Vercel dashboard for the URL:${NC}"
echo -e "   https://vercel.com/dashboard"
