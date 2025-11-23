#!/bin/bash

################################################################################
# STRUCTURE VALIDATION SCRIPT
# Tajawaz Solutions - Enterprise Structure Validator
# Version: 2.0.0
################################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VALIDATE_LOG="$PROJECT_ROOT/validate.log"

echo "================================================================================="
echo "  TAJAWAZ SOLUTIONS - STRUCTURE VALIDATION"
echo "================================================================================="
echo "Validation started at: $(date +"%Y-%m-%d %H:%M:%S")"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERROR_COUNT=0
WARN_COUNT=0

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$VALIDATE_LOG"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$VALIDATE_LOG"
    ((WARN_COUNT++))
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$VALIDATE_LOG"
    ((ERROR_COUNT++))
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$VALIDATE_LOG"
}

# Step 1: Validate required directories
log_info "Step 1/5: Validating directory structure..."

REQUIRED_DIRS=(
    "src"
    "src/pages"
    "src/components"
    "src/assets/css"
    "src/assets/js"
    "src/assets/images"
    "public"
    "public/assets"
    "public/pages"
    "public/components"
    "api"
    "api/controllers"
    "config"
    "docs"
    "scripts"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        log_success "Directory exists: $dir"
    else
        log_error "Directory missing: $dir"
    fi
done

# Step 2: Validate required files
log_info "Step 2/5: Validating required files..."

REQUIRED_FILES=(
    "public/index.html"
    "public/manifest.json"
    "public/sw.js"
    "public/sitemap.xml"
    "public/robots.txt"
    "docs/STRUCTURE.md"
    "docs/ARCHITECTURE.md"
    "scripts/build.sh"
    "scripts/deploy.sh"
    "scripts/optimize.sh"
    "scripts/validate.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        log_success "File exists: $file"
    else
        log_error "File missing: $file"
    fi
done

# Step 3: Validate HTML pages
log_info "Step 3/5: Validating HTML pages..."

HTML_PAGES=(
    "about.html"
    "bio-profile.html"
    "blog.html"
    "case-studies.html"
    "contact.html"
    "faq.html"
    "partnership.html"
    "pricing.html"
    "products-digital.html"
    "search.html"
    "services.html"
    "single-post.html"
    "single-services.html"
    "team.html"
)

for page in "${HTML_PAGES[@]}"; do
    if [ -f "$PROJECT_ROOT/src/pages/$page" ] && [ -f "$PROJECT_ROOT/public/pages/$page" ]; then
        log_success "HTML page: $page (src + public)"
    else
        log_warn "HTML page incomplete: $page"
    fi
done

# Step 4: Validate components
log_info "Step 4/5: Validating components..."

COMPONENTS=(
    "header.html"
    "footer.html"
    "sidebar.html"
    "search-form.html"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$PROJECT_ROOT/src/components/$component" ] && [ -f "$PROJECT_ROOT/public/components/$component" ]; then
        log_success "Component: $component (src + public)"
    else
        log_warn "Component incomplete: $component"
    fi
done

# Step 5: Check for symlinks and references
log_info "Step 5/5: Checking for broken symlinks..."

BROKEN_LINKS=$(find "$PROJECT_ROOT" -xtype l 2>/dev/null | wc -l)
if [ "$BROKEN_LINKS" -eq 0 ]; then
    log_success "No broken symlinks found"
else
    log_warn "Found $BROKEN_LINKS broken symlinks"
fi

# Generate validation report
log_info "Generating validation report..."

cat > "$PROJECT_ROOT/validation-report.txt" << EOF
================================================================================
VALIDATION REPORT
================================================================================
Timestamp: $(date +"%Y-%m-%d %H:%M:%S")
Project: Tajawaz Solutions
Structure Version: 2.0.0 (Enterprise)

SUMMARY:
--------
Errors: $ERROR_COUNT
Warnings: $WARN_COUNT
Broken Symlinks: $BROKEN_LINKS

STATUS: $([ "$ERROR_COUNT" -eq 0 ] && echo "PASSED ✓" || echo "FAILED ✗")

DIRECTORY TREE:
---------------
$(tree -L 2 -d "$PROJECT_ROOT" 2>/dev/null || echo "tree command not available")

FILE STATISTICS:
----------------
Total files: $(find "$PROJECT_ROOT" -type f | wc -l)
HTML files: $(find "$PROJECT_ROOT" -type f -name "*.html" | wc -l)
CSS files: $(find "$PROJECT_ROOT" -type f -name "*.css" | wc -l)
JS files: $(find "$PROJECT_ROOT" -type f -name "*.js" | wc -l)
Image files: $(find "$PROJECT_ROOT" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.svg" -o -name "*.webp" \) | wc -l)

================================================================================
EOF

echo ""
echo "================================================================================="
echo "  VALIDATION COMPLETED"
echo "================================================================================="
echo "Errors: $ERROR_COUNT"
echo "Warnings: $WARN_COUNT"
echo "Status: $([ "$ERROR_COUNT" -eq 0 ] && echo -e "${GREEN}PASSED ✓${NC}" || echo -e "${RED}FAILED ✗${NC}")"
echo ""
echo "Validation report: $PROJECT_ROOT/validation-report.txt"
echo "Validation log: $VALIDATE_LOG"
echo "================================================================================="

if [ "$ERROR_COUNT" -gt 0 ]; then
    exit 1
else
    exit 0
fi
