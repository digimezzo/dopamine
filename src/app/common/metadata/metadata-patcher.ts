import { Injectable } from '@angular/core';

// Whitelist based on https://emby.media/community/index.php?/topic/90915-whitelist-request-for-artists-with-slash-in-name/
export const UNSPLITTABLE_METADATA: string[] = [
    'AC/DC',
    'De/Vision',
    'Ghost/Light',
    'Axwell /\\ Ingrosso',
    'LOONA 1/3',
    'TR/ST',
    'AU/RA',
    '+/-',
    'A/N【eɪ-ɛn】',
    'Akron/Family',
    'Akron/Family & Angels of Light',
    'AM/FM',
    'Ashes/Dust',
    'B/B/S/',
    'BLCK/MRKT/RGNS',
    'Body/Gate/Head',
    'Body/Head',
    'Born/Dead',
    'Burger/Ink',
    'case/lang/veirs',
    'Chicago / London Underground',
    'Dakota/Dakota',
    'Dark/Light',
    'Decades/Failures',
    'The Denison/Kimball Trio',
    'D-W/L-SS',
    'F/i',
    'Friend / Enemy',
    'GZA/Genius',
    'I/O',
    'I/O3',
    'In/Humanity',
    'Love/Lust',
    'Mirror/Dash',
    'Model/Actress',
    'N/N',
    'Neither/Neither World',
    'P1/E',
    'Sick/Tired',
    't/e/u/',
    'tide/edit',
    'V/Vm',
    'White/Lichens',
    'White/Light',
    'Yamantaka // Sonic Titan',
    'GG/06',
    'Kiske/Somerville',
    'Black Forest/Black Sea',
    'Internal/External',
    'Pre/verse',
    'Fixmer/McCarthy',
    'Future/Past',
    'Voigt/465',
    'K/DA',
    'm/a/r/r/s',
    "Jizzy Pearl's Love/Hate",
    'Love/Hate',
    'Turilli/Lione Rhapsody',
    '11/5',
    'Kossoff/Kirke/Tetsu/Rabbit',
    'ADD/C',
    'Green/Blue',
    'Cloak/Dagger',
    'Needles//Pins',
    'ИO///sé',
    '20/20',
    'Sko/Torp',
    'Bremer/McCoy',
    '이달의 소녀 1/3',
    '11/29',
    '60/60',
    'Lil 1/2 Dead',
    'Hunter/Game',
    'Frankfurt/Main Underground United',
    '11/5',
    '.com/kill',
    'The 2/3rds',
    'A/T/O/S',
    'a / / w a y s',
    'PERMANENT//ZEIMP',
    '//◭// ｈｄ ｎｅｔｓｃａｐｅ //◭//',
    '//turntboiフオレバー95',
    '☆滴☆ // D R O P L E T',
    'Infector http://',
    '•••// •/ // •//• • •/• ••• /// /•',
    'A l i c e //',
    'AIBA //',
    'CHAOS//BARISTA',
    'Vantage & The Myracle w/ Hibiya',
    'うさこ // kotu',
    'モールFUTURE/PAST',
    'SOFT://SOUNDS',
    'PΣRMANΣNT//ZΣIMP',
    'ANIMAL // MOTHER',
    'F:\\PORT_RICHEY',
    'Action/Adventure',
    'ＤＯＮＴ/ BＥ/ 正方形',
    'purity://filter',
    'HUNTR/X',
];

@Injectable()
export class MetadataPatcher {
    private unsplittableMetadata: string[] = UNSPLITTABLE_METADATA;

    public joinUnsplittableMetadata(possiblySplitMetadata: string[] | undefined): string[] {
        if (possiblySplitMetadata === undefined) {
            return [];
        }

        if (possiblySplitMetadata.length <= 1) {
            return possiblySplitMetadata;
        }

        const cumulativeMetaData: string[] = []; // For ["a", "b", "c", "d"], contains ["a/b", "a/b/c", "a/b/c/d"]

        for (let start = 0; start < possiblySplitMetadata.length; start++) {
            const current: string[] = [];

            for (let end = start; end < possiblySplitMetadata.length; end++) {
                current.push(possiblySplitMetadata[end]);

                // Only push combinations of length >= 2
                if (current.length > 1) {
                    cumulativeMetaData.push(current.join('/'));
                }
            }
        }

        // Keep only those found in the unsplittableMetadata
        const filteredCumulativeMetaData: string[] = cumulativeMetaData.filter((item) =>
            this.unsplittableMetadata.map((x) => x.toLowerCase()).includes(item.toLowerCase()),
        );

        // Collect all items to remove from possiblySplitMetadata
        const itemsToRemove = new Set<string>();

        for (const item of filteredCumulativeMetaData) {
            const segments: string[] = item.split('/');
            for (const segment of segments) {
                itemsToRemove.add(segment);
            }
        }

        // Create new array without those items
        const cleanedPossiblySplitMetadata = possiblySplitMetadata.filter((item) => !itemsToRemove.has(item));

        // Join them
        return [...cleanedPossiblySplitMetadata, ...filteredCumulativeMetaData];
    }
}
