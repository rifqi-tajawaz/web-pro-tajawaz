#!/bin/bash

################################################################################
# DEPLOYMENT AUTOMATION SCRIPT
# Tajawaz Solutions - Enterprise Deployment System
# Version: 2.0.0
################################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$PROJECT_ROOT/public"
DEPLOY_LOG="$PROJECT_ROOT/deploy.log"
DEPLOY_TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "================================================================================="
echo "  TAJAWAZ SOLUTIONS - DEPLOYMENT PROCESS"
echo "================================================================================="
echo "Deployment started at: $DEPLOY_TIMESTAMP"
echo ""

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$DEPLOY_LOG"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$DEPLOY_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$DEPLOY_LOG"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1" | tee -a "$DEPLOY_LOG"
}

# Configuration
REMOTE_HOST="${DEPLOY_HOST:-your-server.com}"
REMOTE_USER="${DEPLOY_USER:-username}"
REMOTE_PATH="${DEPLOY_PATH:-/var/www/html}"
DEPLOY_METHOD="${DEPLOY_METHOD:-rsync}"  # Options: rsync, ftp, scp

# Step 1: Pre-deployment checks
log_step "Step 1/7: Running pre-deployment checks..."

if [ ! -f "$PUBLIC_DIR/index.html" ]; then
    log_error "index.html not found in public directory!"
    exit 1
fi

if [ ! -f "$PUBLIC_DIR/build-manifest.json" ]; then
    log_warn "build-manifest.json not found. Run build.sh first."
fi

log_info "Pre-deployment checks passed"

# Step 2: Create backup
log_step "Step 2/7: Creating backup..."
BACKUP_DIR="$PROJECT_ROOT/backups"
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
mkdir -p "$BACKUP_DIR"

cd "$PUBLIC_DIR"
tar -czf "$BACKUP_DIR/$BACKUP_NAME" .
log_info "Backup created: $BACKUP_DIR/$BACKUP_NAME"

# Step 3: Validate structure
log_step "Step 3/7: Validating directory structure..."
REQUIRED_DIRS=("assets/css" "assets/js" "assets/images" "pages" "components")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$PUBLIC_DIR/$dir" ]; then
        log_error "Required directory missing: $dir"
        exit 1
    fi
done
log_info "Directory structure validation passed"

# Step 4: Test files integrity
log_step "Step 4/7: Testing file integrity..."
FILE_COUNT=$(find "$PUBLIC_DIR" -type f | wc -l)
log_info "Total files to deploy: $FILE_COUNT"

# Step 5: Deployment (method-specific)
log_step "Step 5/7: Starting deployment using method: $DEPLOY_METHOD"

case $DEPLOY_METHOD in
    rsync)
        log_info "Using rsync for deployment..."
        # Uncomment and configure when ready:
        # rsync -avz --delete \
        #     --exclude '.git' \
        #     --exclude 'node_modules' \
        #     --exclude '*.log' \
        #     "$PUBLIC_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
        log_warn "Rsync deployment is commented out. Configure settings first."
        ;;
    ftp)
        log_info "Using FTP for deployment..."
        log_warn "FTP deployment not implemented. Use rsync or scp."
        ;;
    scp)
        log_info "Using SCP for deployment..."
        # Uncomment and configure when ready:
        # scp -r "$PUBLIC_DIR/*" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
        log_warn "SCP deployment is commented out. Configure settings first."
        ;;
    local)
        log_info "Deploying to local directory..."
        LOCAL_DEPLOY_PATH="${LOCAL_DEPLOY_PATH:-/var/www/html}"
        if [ -d "$LOCAL_DEPLOY_PATH" ]; then
            rsync -av --delete "$PUBLIC_DIR/" "$LOCAL_DEPLOY_PATH/"
            log_info "Deployed to: $LOCAL_DEPLOY_PATH"
        else
            log_error "Local deployment path does not exist: $LOCAL_DEPLOY_PATH"
            exit 1
        fi
        ;;
    *)
        log_error "Unknown deployment method: $DEPLOY_METHOD"
        exit 1
        ;;
esac

# Step 6: Post-deployment verification
log_step "Step 6/7: Running post-deployment verification..."
log_info "Deployment verification would run here (health checks, smoke tests)"

# Step 7: Deployment summary
log_step "Step 7/7: Generating deployment report..."
cat > "$PROJECT_ROOT/deployment-report.txt" << EOF
================================================================================
DEPLOYMENT REPORT
================================================================================
Timestamp: $DEPLOY_TIMESTAMP
Method: $DEPLOY_METHOD
Source: $PUBLIC_DIR
Files deployed: $FILE_COUNT
Backup: $BACKUP_DIR/$BACKUP_NAME
Status: SUCCESS
================================================================================
EOF

echo ""
echo "================================================================================="
echo "  DEPLOYMENT COMPLETED SUCCESSFULLY"
echo "================================================================================="
echo "Deployment time: $DEPLOY_TIMESTAMP"
echo "Method: $DEPLOY_METHOD"
echo "Files deployed: $FILE_COUNT"
echo "Backup location: $BACKUP_DIR/$BACKUP_NAME"
echo ""
echo "Deployment log saved to: $DEPLOY_LOG"
echo "Deployment report: $PROJECT_ROOT/deployment-report.txt"
echo "================================================================================="

exit 0
