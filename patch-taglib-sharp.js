#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/@digimezzo/node-taglib-sharp/dist/id3v2/frames/textInformationFrame.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('f.description !== undefined && f.description !== null')) {
        console.log('[node-taglib-sharp patch] Already patched, skipping');
        process.exit(0);
    }

    const oldSnippet = `        return frames.find((f) => comparison(f.description, description));`;
    // Malformed TXXX frames parse to an undefined description, which makes the case-insensitive comparison throw.
    const newSnippet = `        return frames.find((f) => f.description !== undefined && f.description !== null && comparison(f.description, description));`;

    if (!content.includes(oldSnippet)) {
        console.error('[node-taglib-sharp patch] Expected snippet not found');
        process.exit(1);
    }

    content = content.replace(oldSnippet, newSnippet);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('[node-taglib-sharp patch] Patch applied');
} catch (error) {
    console.error('[node-taglib-sharp patch] Failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
}
