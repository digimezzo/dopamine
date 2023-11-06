import { Injectable } from '@angular/core';
import { StringUtils } from '../utils/string-utils';

@Injectable()
export class PathValidator {
    /**
     * Determines if parentPath is a parent path childPath
     * Based on: https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js
     */
    public isParentPath(parentPath: string | undefined, childPath: string | undefined): boolean {
        if (StringUtils.isNullOrWhiteSpace(parentPath)) {
            return false;
        }

        if (StringUtils.isNullOrWhiteSpace(childPath)) {
            return false;
        }

        // Node.js has a function path.sep, which returns the path separator for the current platform.
        // I chose to not use it, in order to be able to test Linux and Windows paths in Unit Tests.
        // With path.sep, only the tests for the platform on which they run, would pass.
        let pathSeparator: string = '/';

        if (childPath!.includes('\\')) {
            pathSeparator = '\\';
        }

        const parentParts = parentPath!.split(pathSeparator);
        const childParts = childPath!.split(pathSeparator);

        return parentParts.every((parentPartValue, parentPartIndex) => childParts[parentPartIndex] === parentPartValue);
    }
}
