# Dopamine change log

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.3] - 2026-02-09

### Added

- Added shuffle option to the artist, genre and album context menus.
- Added shuffle all on artist, genre, album and songs screens.

### Changed

- Updated the Croatian translation
- Updated the Portuguese (Portugal) translation
- Updated the Simplified Chinese translation
- Updated the Spanish translation

### Fixed

- Genres which are starting with numbers are incorrectly detected

## [3.0.2] - 2026-01-17

### Added

- Added a Highlights screen showing your most played albums
- Added Composers, Conductor and BPM to tag editor.

### Changed

- Updated the Turkish translation
- Updated the Vietnamese translation

### Fixed

- Fixed a crash that occurred when playing a song from the playback queue
- Fixed some album view issues
- Fixed an issue causing the wrong song to play when started from the Operating System

## [3.0.1] - 2025-12-19

### Added

- Added half-star rating support, expanding the song rating scale to a range of 0–10.
- Added song sorting options on the 'Folders' screen
- Added a button to toggle between the default expanded album view and Dopamine 2's compact album view
- Added the removable-media plug to the Snap configuration, allowing the Snap version of Dopamine to access /media.

### Changed

- Updated the Kurdish translation
- Updated the Russian translation
- Updated the Spanish translation
- Updated the Swedish translation
- Updated the Vietnamese translation

### Fixed

- m3u8 playlists are not recognized
- Ratings are not read from files
- Developer console opens when pressing F12
- Crash when trying to play a deleted file
- Song length in right sidebar displays double the time of the real length
- Some issues with fetching of lyrics
- Folders context menu opens too much the left on the Folders screen
- Crash when the user has no Music directory
- Crash when trying to play ALAC M4A file. Those are not supported. Instead of a crash, the user is now informed why the file doesn't play.
- Crash when starting files from the operating system's file browser
- Issue where the Edit song dialog replaces '/' by ';' for artists containing a '/' in their name
- Linux Snap issue that caused file dialog text to appear as squares instead of readable characters

## [3.0.0] - 2025-11-06

First release!

Highlights:

- Multi-platform support - Dopamine now runs seamlessly on Windows, Linux, and macOS.
- Playlist folders - Organize your playlists into folders for better structure and easier navigation.
- Gapless playback - Enjoy smooth, uninterrupted transitions between tracks.
- Logarithmic volume control - Experience more natural and precise volume adjustments.
- Artist splitting - Automatically split multiple artists using customizable separators (e.g., “ft.”, “feat.”).
- Album grouping options - Choose how albums are defined and displayed for greater control over your library organization.
- Last.fm integration - Scrobble your music and download artist information directly from Last.fm.
- Lyrics support - Display offline or online lyrics while listening to your favorite songs.
- Discord integration - Show your currently playing track on Discord in real time.
