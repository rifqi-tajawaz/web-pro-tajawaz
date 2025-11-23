#!/bin/bash

################################################################################
# BUILD AUTOMATION SCRIPT
# Tajawaz Solutions - Enterprise Build System
# Version: 2.0.0
################################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
PUBLIC_DIR="$PROJECT_ROOT/public"
BUILD_LOG="$PROJECT_ROOT/build.log"
BUILD_TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "================================================================================="
echo "  TAJAWAZ SOLUTIONS - BUILD PROCESS"
echo "================================================================================="
echo "Build started at: $BUILD_TIMESTAMP"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$BUILD_LOG"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$BUILD_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$BUILD_LOG"
}

# Step 1: Clean previous build
log_info "Step 1/6: Cleaning previous build..."
if [ -d "$PUBLIC_DIR/assets" ]; then
    rm -rf "$PUBLIC_DIR/assets"
    log_info "Cleaned: $PUBLIC_DIR/assets"
fi

# Step 2: Create public directories
log_info "Step 2/6: Creating public directory structure..."
mkdir -p "$PUBLIC_DIR/assets"/{css,js,images,fonts,data}
log_info "Directory structure created"

# Step 3: Copy assets from src to public
log_info "Step 3/6: Copying assets to public..."

# Copy CSS
log_info "  - Copying CSS files..."
cp -r "$SRC_DIR/assets/css/"* "$PUBLIC_DIR/assets/css/"

# Copy JavaScript
log_info "  - Copying JavaScript files..."
cp -r "$SRC_DIR/assets/js/"* "$PUBLIC_DIR/assets/js/"

# Copy Images
log_info "  - Copying images..."
cp -r "$SRC_DIR/assets/images/"* "$PUBLIC_DIR/assets/images/"

# Copy Fonts
log_info "  - Copying fonts..."
cp -r "$SRC_DIR/assets/fonts/"* "$PUBLIC_DIR/assets/fonts/"

# Copy Data
log_info "  - Copying data files..."
if [ -d "$SRC_DIR/assets/data" ]; then
    cp -r "$SRC_DIR/assets/data/"* "$PUBLIC_DIR/assets/data/" 2>/dev/null || true
fi

# Step 4: Copy HTML pages and components
log_info "Step 4/6: Copying HTML files..."
cp -r "$SRC_DIR/pages/"* "$PUBLIC_DIR/pages/"
cp -r "$SRC_DIR/components/"* "$PUBLIC_DIR/components/"

# Step 5: Generate build manifest
log_info "Step 5/6: Generating build manifest..."
cat > "$PUBLIC_DIR/build-manifest.json" << EOF
{
  "buildDate": "$BUILD_TIMESTAMP",
  "version": "2.0.0",
  "environment": "production",
  "builder": "build.sh",
  "structure": "enterprise",
  "files": {
    "css": $(find "$PUBLIC_DIR/assets/css" -type f | wc -l),
    "js": $(find "$PUBLIC_DIR/assets/js" -type f | wc -l),
    "images": $(find "$PUBLIC_DIR/assets/images" -type f | wc -l),
    "fonts": $(find "$PUBLIC_DIR/assets/fonts" -type f | wc -l),
    "pages": $(find "$PUBLIC_DIR/pages" -type f -name "*.html" | wc -l),
    "components": $(find "$PUBLIC_DIR/components" -type f -name "*.html" | wc -l)
  }
}
EOF
log_info "Build manifest created"

# Step 6: Calculate sizes
log_info "Step 6/6: Calculating build statistics..."
TOTAL_SIZE=$(du -sh "$PUBLIC_DIR" | cut -f1)
CSS_SIZE=$(du -sh "$PUBLIC_DIR/assets/css" | cut -f1)
JS_SIZE=$(du -sh "$PUBLIC_DIR/assets/js" | cut -f1)
IMAGE_SIZE=$(du -sh "$PUBLIC_DIR/assets/images" | cut -f1)

echo ""
echo "================================================================================="
echo "  BUILD COMPLETED SUCCESSFULLY"
echo "================================================================================="
echo "Build time: $BUILD_TIMESTAMP"
echo "Total size: $TOTAL_SIZE"
echo "  - CSS:    $CSS_SIZE"
echo "  - JS:     $JS_SIZE"
echo "  - Images: $IMAGE_SIZE"
echo ""
echo "Build artifacts available in: $PUBLIC_DIR"
echo "Build log saved to: $BUILD_LOG"
echo "================================================================================="

exit 0
