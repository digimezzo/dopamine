#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/discord-rpc/src/client.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('type: args.type,')) {
        console.log('[discord-rpc patch] Already patched, skipping');
        process.exit(0);
    }

    const oldSnippet = `        buttons: args.buttons,\n        instance: !!args.instance,`;
    const newSnippet = `        buttons: args.buttons,\n        instance: !!args.instance,\n        type: args.type,`;

    if (!content.includes(oldSnippet)) {
        console.error('[discord-rpc patch] Expected snippet not found');
        process.exit(1);
    }

    content = content.replace(oldSnippet, newSnippet);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('[discord-rpc patch] Patch applied');
} catch (error) {
    console.error('[discord-rpc patch] Failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
}
