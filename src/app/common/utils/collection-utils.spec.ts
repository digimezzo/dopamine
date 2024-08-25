import { StringUtils } from './string-utils';
import { CollectionUtils } from './collections-utils';

describe('CollectionUtils', () => {
    describe('fromString', () => {
        it('should return an empty collection if the string is undefined', () => {
            // Assert
            expect(CollectionUtils.fromString(undefined)).toEqual([]);
        });

        it('should return an empty collection if the string is empty', () => {
            // Assert
            expect(CollectionUtils.fromString('')).toEqual([]);
        });

        it('should return an empty collection if the string is whitespace', () => {
            // Assert
            expect(CollectionUtils.fromString(' ')).toEqual([]);
        });

        it('should return an empty collection if the string is whitespace', () => {
            // Assert
            expect(CollectionUtils.fromString(' ')).toEqual([]);
        });

        it('should return a collection with the given string as first item if it does not start with [', () => {
            // Assert
            expect(CollectionUtils.fromString('item1][item2]')).toEqual(['item1][item2]']);
        });

        it('should return a collection with the given string as first item if it does not end with ]', () => {
            // Assert
            expect(CollectionUtils.fromString('[item1][item2')).toEqual(['[item1][item2']);
        });

        it('should return a collection with the given string as first item if it does not start with [ and end with ]', () => {
            // Assert
            expect(CollectionUtils.fromString('item1][item2')).toEqual(['item1][item2']);
        });

        it('should return a collection with the given string as first item if the string only has 1 item', () => {
            // Assert
            expect(CollectionUtils.fromString('[item1]')).toEqual(['item1']);
        });

        it('should return a collection with all items if the string only has multiple items', () => {
            // Assert
            expect(CollectionUtils.fromString('[item1][item2][item3]')).toEqual(['item1', 'item2', 'item3']);
        });
    });

    describe('toString', () => {
        it('should return an empty string if the collection is undefined', () => {
            // Assert
            expect(CollectionUtils.toString(undefined)).toEqual('');
        });

        it('should return an empty string if the collection is empty', () => {
            // Assert
            expect(CollectionUtils.toString([])).toEqual('');
        });

        it('should return a string with the items joined by ][', () => {
            // Assert
            expect(CollectionUtils.toString(['item1', 'item2', 'item3'])).toEqual('[item1][item2][item3]');
        });
    });
});
