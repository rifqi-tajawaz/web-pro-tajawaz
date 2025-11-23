#!/bin/bash

################################################################################
# ASSET OPTIMIZATION SCRIPT
# Tajawaz Solutions - Performance Optimization
# Version: 2.0.0
################################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
OPTIMIZE_LOG="$PROJECT_ROOT/optimize.log"

echo "================================================================================="
echo "  TAJAWAZ SOLUTIONS - ASSET OPTIMIZATION"
echo "================================================================================="
echo "Optimization started at: $(date +"%Y-%m-%d %H:%M:%S")"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$OPTIMIZE_LOG"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$OPTIMIZE_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$OPTIMIZE_LOG"
}

# Check for optimization tools
HAS_OPTIPNG=$(command -v optipng &> /dev/null && echo "yes" || echo "no")
HAS_JPEGOPTIM=$(command -v jpegoptim &> /dev/null && echo "yes" || echo "no")
HAS_UGLIFYJS=$(command -v uglifyjs &> /dev/null && echo "yes" || echo "no")
HAS_CLEANCSS=$(command -v cleancss &> /dev/null && echo "yes" || echo "no")

log_info "Checking available optimization tools..."
log_info "  - optipng: $HAS_OPTIPNG"
log_info "  - jpegoptim: $HAS_JPEGOPTIM"
log_info "  - uglifyjs: $HAS_UGLIFYJS"
log_info "  - cleancss: $HAS_CLEANCSS"

# Step 1: Optimize Images
log_info "Step 1/4: Analyzing images..."
IMAGE_DIR="$SRC_DIR/assets/images"
if [ -d "$IMAGE_DIR" ]; then
    PNG_COUNT=$(find "$IMAGE_DIR" -type f -name "*.png" | wc -l)
    JPG_COUNT=$(find "$IMAGE_DIR" -type f -name "*.jpg" -o -name "*.jpeg" | wc -l)
    log_info "Found $PNG_COUNT PNG files and $JPG_COUNT JPEG files"
    
    if [ "$HAS_OPTIPNG" = "yes" ]; then
        log_info "Optimizing PNG files..."
        find "$IMAGE_DIR" -type f -name "*.png" -exec optipng -o2 {} \; 2>&1 | tee -a "$OPTIMIZE_LOG"
    else
        log_warn "optipng not installed. Skipping PNG optimization."
        log_info "Install: sudo apt-get install optipng"
    fi
    
    if [ "$HAS_JPEGOPTIM" = "yes" ]; then
        log_info "Optimizing JPEG files..."
        find "$IMAGE_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) -exec jpegoptim --max=85 {} \; 2>&1 | tee -a "$OPTIMIZE_LOG"
    else
        log_warn "jpegoptim not installed. Skipping JPEG optimization."
        log_info "Install: sudo apt-get install jpegoptim"
    fi
else
    log_warn "Image directory not found: $IMAGE_DIR"
fi

# Step 2: Analyze CSS
log_info "Step 2/4: Analyzing CSS files..."
CSS_DIR="$SRC_DIR/assets/css"
if [ -d "$CSS_DIR" ]; then
    CSS_COUNT=$(find "$CSS_DIR" -type f -name "*.css" | wc -l)
    CSS_SIZE=$(du -sh "$CSS_DIR" | cut -f1)
    log_info "Found $CSS_COUNT CSS files (Total: $CSS_SIZE)"
    
    if [ "$HAS_CLEANCSS" = "yes" ]; then
        log_info "CSS minification available (cleancss installed)"
        log_warn "Manual minification needed. Run: cleancss -o output.min.css input.css"
    else
        log_warn "cleancss not installed. Install: npm install -g clean-css-cli"
    fi
fi

# Step 3: Analyze JavaScript
log_info "Step 3/4: Analyzing JavaScript files..."
JS_DIR="$SRC_DIR/assets/js"
if [ -d "$JS_DIR" ]; then
    JS_COUNT=$(find "$JS_DIR" -type f -name "*.js" | wc -l)
    JS_SIZE=$(du -sh "$JS_DIR" | cut -f1)
    log_info "Found $JS_COUNT JavaScript files (Total: $JS_SIZE)"
    
    if [ "$HAS_UGLIFYJS" = "yes" ]; then
        log_info "JavaScript minification available (uglifyjs installed)"
        log_warn "Manual minification needed. Run: uglifyjs input.js -c -m -o output.min.js"
    else
        log_warn "uglifyjs not installed. Install: npm install -g uglify-js"
    fi
fi

# Step 4: Generate optimization report
log_info "Step 4/4: Generating optimization report..."
TOTAL_SIZE=$(du -sh "$SRC_DIR/assets" | cut -f1)

cat > "$PROJECT_ROOT/optimization-report.txt" << EOF
================================================================================
OPTIMIZATION REPORT
================================================================================
Timestamp: $(date +"%Y-%m-%d %H:%M:%S")
Project: Tajawaz Solutions

ASSET SUMMARY:
--------------
Total assets size: $TOTAL_SIZE
Images (PNG): $PNG_COUNT files
Images (JPEG): $JPG_COUNT files
CSS files: $CSS_COUNT files ($CSS_SIZE)
JavaScript files: $JS_COUNT files ($JS_SIZE)

OPTIMIZATION TOOLS:
-------------------
optipng: $HAS_OPTIPNG
jpegoptim: $HAS_JPEGOPTIM
uglifyjs: $HAS_UGLIFYJS
cleancss: $HAS_CLEANCSS

RECOMMENDATIONS:
----------------
1. Install missing optimization tools
2. Minify custom CSS and JavaScript files
3. Use WebP format for images where possible
4. Implement lazy loading for images
5. Consider using a CDN for static assets
6. Enable GZIP compression on web server
7. Leverage browser caching with proper headers

================================================================================
EOF

echo ""
echo "================================================================================="
echo "  OPTIMIZATION ANALYSIS COMPLETED"
echo "================================================================================="
echo "Total assets size: $TOTAL_SIZE"
echo ""
echo "Optimization report: $PROJECT_ROOT/optimization-report.txt"
echo "Optimization log: $OPTIMIZE_LOG"
echo "================================================================================="

exit 0
