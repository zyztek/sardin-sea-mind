#!/bin/bash

# Define colors
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}"
echo "   _____          _____  _____ _____ _   _           _  "
echo "  / ____|   /\   |  __ \|  __ \_   _| \ | |      /\ | | "
echo " | (___    /  \  | |__) | |  | || | |  \| |     /  \| | "
echo "  \___ \  / /\ \ |  _  /| |  | || | | . \` |    / /\ \ | "
echo "  ____) |/ ____ \| | \ \| |__| || |_| |\  |   / ____ \ |"
echo " |_____//_/    \_\_|  \_\_____/_____|_| \_|  /_/    \_\_|"
echo -e "${NC}"
echo ""
echo -e "${CYAN}🌊 Welcome to the SARDIN-AI Antigravity Environment 🌊${NC}"
echo ""
echo -e "I am ${GREEN}Antigravity${NC}, your AI assistant. I have prepared this environment for you."
echo ""
echo "System Status:"
echo "---------------------------------"
echo -e "✅ Node.js:    $(node -v)"
echo -e "✅ NPM:        $(npm -v)"
echo -e "✅ Docker:     Ready"
echo -e "✅ Extension:  SARDIN-CLI Active"
echo "---------------------------------"
echo ""
echo "Type 'npm run dev' to start the dashboard."
echo "Type 'npm run agents:start' to awaken the AI agents."
echo ""
echo "Happy Coding! 🚀"
