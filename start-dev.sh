#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}🚀 Starting Coleccionables Panamá Dev Environment${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  Not in project root. Navigating to coleccionablespanama...${NC}"
    cd coleccionablespanama 2>/dev/null || {
        echo "❌ Could not find coleccionablespanama directory"
        exit 1
    }
fi

echo -e "${GREEN}✅ Starting JSON Server (Mock API)...${NC}"
echo -e "   📡 API will be available at: ${BLUE}http://localhost:3001${NC}"
echo ""

# Start JSON Server in background
npm run api &
API_PID=$!

# Wait for API to start
sleep 3

# Check if API started successfully
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ JSON Server running successfully!${NC}"
    echo ""
echo -e "${GREEN}📋 Available endpoints:${NC}"
echo -e "   • Items:       ${BLUE}http://localhost:3001/items${NC} (alias: /assets)"
echo -e "   • Collections: ${BLUE}http://localhost:3001/collections${NC}"
echo -e "   • Bundles:     ${BLUE}http://localhost:3001/bundles${NC}"
    echo ""
else
    echo -e "❌ Failed to start JSON Server"
    exit 1
fi

echo -e "${GREEN}✅ Starting Next.js Frontend...${NC}"
echo -e "   🌐 Frontend will be available at: ${BLUE}http://localhost:4200${NC}"
echo ""
echo -e "${YELLOW}📝 Note: Press Ctrl+C to stop both servers${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Start Next.js (this will run in foreground)
npx nx serve main

# Cleanup: Kill API server when frontend stops
kill $API_PID 2>/dev/null
echo ""
echo -e "${GREEN}✅ Servers stopped. Goodbye!${NC}"
