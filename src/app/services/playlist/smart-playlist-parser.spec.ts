import { IMock, Mock, Times } from 'typemoq';
import { FileAccessBase } from '../../common/io/file-access.base';
import { SmartPlaylistDefinition, SmartPlaylistParser } from './smart-playlist-parser';

describe('SmartPlaylistParser', () => {
    let fileAccessMock: IMock<FileAccessBase>;
    let parser: SmartPlaylistParser;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<FileAccessBase>();
        parser = new SmartPlaylistParser(fileAccessMock.object);
    });

    describe('parse', () => {
        it('should parse bpm rules from dspl payload', () => {
            // Arrange
            const playlistPath = '/home/user/Music/Playlists/Fast songs.dspl';
            const dsplContent = `<?xml version="1.0" encoding="utf-8"?>
<smartplaylist>
  <name>Fast songs</name>
  <match>all</match>
  <limit type="songs">25</limit>
  <rule field="bpm" operator="greaterthan">120</rule>
  <rule field="genre" operator="contains">Rock</rule>
</smartplaylist>`;

            fileAccessMock.setup((x) => x.getFileContentAsString(playlistPath)).returns(() => dsplContent);

            // Act
            const definition: SmartPlaylistDefinition = parser.parse(playlistPath);

            // Assert
            expect(definition.name).toBe('Fast songs');
            expect(definition.match).toBe('all');
            expect(definition.limitType).toBe('songs');
            expect(definition.limitValue).toBe(25);
            expect(definition.rules.length).toBe(2);
            expect(definition.rules[0]).toEqual({ field: 'bpm', operator: 'greaterthan', value: '120' });
            expect(definition.rules[1]).toEqual({ field: 'genre', operator: 'contains', value: 'Rock' });
            fileAccessMock.verify((x) => x.getFileContentAsString(playlistPath), Times.once());
        });
    });
});
