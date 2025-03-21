#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Argument Mapping Tool Local Development ===${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    echo "Please install npm, which usually comes with Node.js"
    exit 1
fi

# Check if the package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found.${NC}"
    echo "Make sure you're running this script from the project root directory."
    exit 1
fi

npm update

echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies.${NC}"
    exit 1
fi

echo -e "${GREEN}Starting development server...${NC}"
echo -e "${YELLOW}The application will be available at http://localhost:3000${NC}"

# Start the development server
npm start

# This line will only execute if npm start fails or is terminated
echo -e "${RED}Development server has stopped.${NC}"