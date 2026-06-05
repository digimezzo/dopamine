#!/usr/bin/env bash
# Repackages the AppImage built by electron-builder with the latest appimagetool
# so that the resulting AppImage uses the fuse3-compatible type2 runtime.
# This fixes "dlopen(): error loading libfuse.so.2" on modern distros
# (Fedora 44+, Ubuntu 24.04+) that no longer ship libfuse2.

set -euo pipefail

RELEASE_DIR="${1:-release}"
ARCH="${2:-x86_64}"

APPIMAGETOOL_URL="https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-${ARCH}.AppImage"
APPIMAGETOOL="./appimagetool-${ARCH}.AppImage"

# Find the AppImage built by electron-builder
APPIMAGE=$(find "$RELEASE_DIR" -maxdepth 1 -name "*.AppImage" -type f | head -1)
if [[ -z "$APPIMAGE" ]]; then
    echo "ERROR: No AppImage found in $RELEASE_DIR"
    exit 1
fi

echo "Found AppImage: $APPIMAGE"

# Download appimagetool if not already present
if [[ ! -f "$APPIMAGETOOL" ]]; then
    echo "Downloading appimagetool..."
    curl -fSL "$APPIMAGETOOL_URL" -o "$APPIMAGETOOL"
    chmod +x "$APPIMAGETOOL"
fi

# Extract the existing AppImage
echo "Extracting AppImage..."
rm -rf squashfs-root
"$APPIMAGE" --appimage-extract > /dev/null 2>&1

# Repackage with fuse3-compatible runtime using appimagetool.
# APPIMAGE_EXTRACT_AND_RUN=1 allows appimagetool (itself an AppImage) to run
# without fuse2 on the build machine.
echo "Repackaging with fuse3-compatible runtime..."
ARCH="$ARCH" APPIMAGE_EXTRACT_AND_RUN=1 "$APPIMAGETOOL" squashfs-root "$APPIMAGE"

# Clean up
rm -rf squashfs-root

echo "Done. AppImage repackaged with fuse3 runtime: $APPIMAGE"
