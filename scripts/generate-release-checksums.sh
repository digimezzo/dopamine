#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 || ( "$2" != "nightly" && "$2" != "merge" ) ]]; then
    echo "Usage: $0 <artifact-directory> <nightly|merge>" >&2
    exit 1
fi

artifact_directory=$1
prefix="dopamine-$2"
shopt -s nullglob

checksum_artifact() {
    local artifact=$1 pattern=$2
    local files=("$artifact_directory/$prefix-$artifact"/$pattern)
    if [[ ${#files[@]} -ne 1 ]]; then
        echo "Expected exactly one $pattern in $prefix-$artifact, found ${#files[@]}" >&2
        return 1
    fi
    (cd "$(dirname "${files[0]}")" && sha256sum -- "$(basename "${files[0]}")")
}

checksum_artifact rpm 'Dopamine-*.rpm'
checksum_artifact deb 'Dopamine-*.deb'
checksum_artifact appimage 'Dopamine-*.AppImage'
checksum_artifact snap 'Dopamine-*.snap'
checksum_artifact pacman 'Dopamine-*.pacman'
checksum_artifact macos-arm 'Dopamine-*-arm.dmg'
checksum_artifact macos-intel 'Dopamine-*-intel.dmg'
checksum_artifact windows-installer 'Dopamine-*.exe'
